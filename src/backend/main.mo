import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Int "mo:core/Int";
import Order "mo:core/Order";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Text "mo:core/Text";
import Time "mo:core/Time";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";


actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
  include MixinStorage();

  public type UserProfile = {
    name : Text;
    email : ?Text;
    phone : ?Text;
  };

  public type Nurse = {
    id : Text;
    name : Text;
    registrationNumber : Text;
    phone : Text;
    village : Text;
    mandal : Text;
    district : Text;
    pincode : Nat;
    experience : Nat;
    bio : Text;
    profilePhoto : ?Storage.ExternalBlob;
    isAvailable : Bool;
    latitude : ?Float;
    longitude : ?Float;
  };

  public type Feedback = {
    id : Text;
    nurseId : Text;
    patientName : Text;
    rating : Nat;
    reviewText : Text;
    mediaUrls : [Storage.ExternalBlob];
    createdAt : Time.Time;
  };

  public type ServiceProof = {
    id : Text;
    nurseId : Text;
    description : Text;
    photoUrls : [Storage.ExternalBlob];
    videoUrl : ?Storage.ExternalBlob;
    createdAt : Time.Time;
  };

  // Stable storage (survives upgrades / redeployments)
  stable var stableNurses : [Nurse] = [];
  stable var stableFeedbacks : [Feedback] = [];
  stable var stableServiceProofs : [ServiceProof] = [];

  // In-memory working maps
  let userProfiles = Map.empty<Principal, UserProfile>();
  let nurses = Map.empty<Text, Nurse>();
  let feedbacks = Map.empty<Text, Feedback>();
  let serviceProofs = Map.empty<Text, ServiceProof>();

  // Restore maps from stable arrays after every upgrade
  system func postupgrade() {
    for (n in stableNurses.vals()) {
      nurses.add(n.id, n);
    };
    stableNurses := [];
    for (f in stableFeedbacks.vals()) {
      feedbacks.add(f.id, f);
    };
    stableFeedbacks := [];
    for (sp in stableServiceProofs.vals()) {
      serviceProofs.add(sp.id, sp);
    };
    stableServiceProofs := [];
  };

  // Save maps to stable arrays before every upgrade
  system func preupgrade() {
    stableNurses := nurses.values().toArray();
    stableFeedbacks := feedbacks.values().toArray();
    stableServiceProofs := serviceProofs.values().toArray();
  };

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized");
    };
    userProfiles.add(caller, profile);
  };

  // Public registration - no ICP auth required
  public shared func registerNurse(nurse : Nurse) : async () {
    validateNurse(nurse);
    if (nurses.containsKey(nurse.id)) {
      Runtime.trap("Nurse already exists with this ID");
    };
    nurses.add(nurse.id, nurse);
  };

  // Update nurse details - no ICP auth (admin uses frontend password)
  public shared func updateNurse(nurse : Nurse) : async () {
    validateNurse(nurse);
    switch (nurses.get(nurse.id)) {
      case (null) { Runtime.trap("Nurse does not exist") };
      case (?_) {
        nurses.remove(nurse.id);
        nurses.add(nurse.id, nurse);
      };
    };
  };

  // Delete nurse - no ICP auth (admin uses frontend password)
  public shared func deleteNurse(nurseId : Text) : async () {
    nurses.remove(nurseId);
  };

  // Nurse toggles their own availability using credentials
  public shared func setNurseAvailability(registrationNumber : Text, phone : Text, isAvailable : Bool) : async () {
    var found : ?Nurse = null;
    for (n in nurses.values()) {
      if (n.registrationNumber == registrationNumber and n.phone == phone) {
        found := ?n;
      };
    };
    switch (found) {
      case (null) { Runtime.trap("Nurse not found. Check registration number and phone.") };
      case (?nurse) {
        let updated : Nurse = {
          id = nurse.id;
          name = nurse.name;
          registrationNumber = nurse.registrationNumber;
          phone = nurse.phone;
          village = nurse.village;
          mandal = nurse.mandal;
          district = nurse.district;
          pincode = nurse.pincode;
          experience = nurse.experience;
          bio = nurse.bio;
          profilePhoto = nurse.profilePhoto;
          isAvailable = isAvailable;
          latitude = nurse.latitude;
          longitude = nurse.longitude;
        };
        nurses.remove(nurse.id);
        nurses.add(nurse.id, updated);
      };
    };
  };

  // Nurse updates their own location using credentials
  public shared func updateNurseLocation(registrationNumber : Text, phone : Text, latitude : Float, longitude : Float) : async () {
    var found : ?Nurse = null;
    for (n in nurses.values()) {
      if (n.registrationNumber == registrationNumber and n.phone == phone) {
        found := ?n;
      };
    };
    switch (found) {
      case (null) { Runtime.trap("Nurse not found. Check registration number and phone.") };
      case (?nurse) {
        let updated : Nurse = {
          id = nurse.id;
          name = nurse.name;
          registrationNumber = nurse.registrationNumber;
          phone = nurse.phone;
          village = nurse.village;
          mandal = nurse.mandal;
          district = nurse.district;
          pincode = nurse.pincode;
          experience = nurse.experience;
          bio = nurse.bio;
          profilePhoto = nurse.profilePhoto;
          isAvailable = nurse.isAvailable;
          latitude = ?latitude;
          longitude = ?longitude;
        };
        nurses.remove(nurse.id);
        nurses.add(nurse.id, updated);
      };
    };
  };

  public query func getNurse(id : Text) : async ?Nurse {
    nurses.get(id);
  };

  public query func listAllNurses() : async [Nurse] {
    nurses.values().toArray();
  };

  public query func filterByPincode(pincode : Nat) : async [Nurse] {
    nurses.values().toArray().filter(func(n : Nurse) : Bool { n.pincode == pincode });
  };

  // Anyone can submit feedback
  public shared func submitFeedback(feedback : Feedback) : async () {
    if (feedback.rating < 1 or feedback.rating > 5) {
      Runtime.trap("Invalid rating: must be between 1 and 5");
    };
    switch (nurses.get(feedback.nurseId)) {
      case (null) { Runtime.trap("Nurse does not exist") };
      case (?_) {
        feedbacks.add(feedback.id, feedback);
      };
    };
  };

  public query func getNurseFeedback(nurseId : Text) : async [Feedback] {
    feedbacks.values().toArray().filter(func(f : Feedback) : Bool { f.nurseId == nurseId });
  };

  public query func getAggregateRating(nurseId : Text) : async ?Float {
    var total : Nat = 0;
    var count : Nat = 0;
    for (f in feedbacks.values()) {
      if (f.nurseId == nurseId) {
        total += f.rating;
        count += 1;
      };
    };
    if (count == 0) { return null };
    ?(total.toFloat() / count.toFloat());
  };

  // Nurses can add service proofs
  public shared func addServiceProof(proof : ServiceProof) : async () {
    if (serviceProofs.containsKey(proof.id)) {
      Runtime.trap("Service proof already exists with this ID");
    };
    serviceProofs.add(proof.id, proof);
  };

  // Update service proof - no ICP auth (admin uses frontend password)
  public shared func updateServiceProof(proof : ServiceProof) : async () {
    switch (serviceProofs.get(proof.id)) {
      case (null) { Runtime.trap("Service proof does not exist") };
      case (?_) {
        serviceProofs.remove(proof.id);
        serviceProofs.add(proof.id, proof);
      };
    };
  };

  // Delete service proof - no ICP auth (admin uses frontend password)
  public shared func deleteServiceProof(proofId : Text) : async () {
    serviceProofs.remove(proofId);
  };

  public query func getNurseServiceProofs(nurseId : Text) : async [ServiceProof] {
    serviceProofs.values().toArray().filter(func(sp : ServiceProof) : Bool { sp.nurseId == nurseId });
  };

  public query func listAllServiceProofs() : async [ServiceProof] {
    serviceProofs.values().toArray();
  };

  // Find nurse by credentials (for dashboard login)
  public query func findNurseByCredentials(registrationNumber : Text, phone : Text) : async ?Nurse {
    var found : ?Nurse = null;
    for (n in nurses.values()) {
      if (n.registrationNumber == registrationNumber and n.phone == phone) {
        found := ?n;
      };
    };
    found;
  };

  func validateNurse(nurse : Nurse) {
    let pinLength = nurse.pincode.toText().size();
    if (pinLength != 6) {
      Runtime.trap("Invalid PIN code. Must be 6 digits");
    };
    if (nurse.registrationNumber == "") {
      Runtime.trap("Nursing Council Registration Number is required");
    };
  };
};
