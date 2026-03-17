import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "@tanstack/react-router";
import { Clock, MapPin, Phone } from "lucide-react";
import type { Nurse } from "../backend";

interface NurseCardProps {
  nurse: Nurse;
  index?: number;
}

export function NurseCard({ nurse, index = 1 }: NurseCardProps) {
  const photoUrl = nurse.profilePhoto ? nurse.profilePhoto.getDirectURL() : "";
  const initials = nurse.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <Card
      className="overflow-hidden card-shadow border-border hover:shadow-md transition-shadow duration-200"
      data-ocid={`nurses.item.${index}`}
    >
      <CardContent className="p-0">
        <Link to="/nurses/$id" params={{ id: nurse.id }} className="block">
          <div className="relative h-48 bg-secondary flex items-center justify-center overflow-hidden">
            <Avatar className="w-32 h-32">
              <AvatarImage
                src={photoUrl}
                alt={nurse.name}
                className="object-cover"
              />
              <AvatarFallback className="text-3xl font-bold bg-primary text-primary-foreground">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="absolute top-3 right-3">
              <Badge
                className={
                  nurse.isAvailable
                    ? "bg-accent text-accent-foreground"
                    : "bg-muted text-muted-foreground"
                }
              >
                {nurse.isAvailable ? "Available" : "Unavailable"}
              </Badge>
            </div>
          </div>
        </Link>
        <div className="p-4">
          <Link to="/nurses/$id" params={{ id: nurse.id }}>
            <h3 className="font-semibold text-lg text-foreground hover:text-primary transition-colors">
              {nurse.name}
            </h3>
          </Link>
          <p className="text-muted-foreground text-sm mt-0.5">
            {nurse.specialization}
          </p>
          <div className="flex flex-col gap-1.5 mt-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock size={14} className="text-primary" />
              <span>{Number(nurse.experience)} years experience</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin size={14} className="text-primary" />
              <span>Pincode: {nurse.pincode.toString()}</span>
            </div>
          </div>
          <a
            href={`tel:${nurse.phone}`}
            className="mt-4 flex items-center justify-center gap-2 w-full py-2.5 rounded-lg call-btn font-semibold text-sm transition-colors"
            data-ocid={`nurses.button.${index}`}
          >
            <Phone size={16} />
            Call Now
          </a>
        </div>
      </CardContent>
    </Card>
  );
}

interface SampleNurseCardProps {
  name: string;
  specialization: string;
  experience: number;
  pincode: string;
  phone: string;
  isAvailable: boolean;
  photoUrl: string;
  initials: string;
  id: string;
  index?: number;
}

export function SampleNurseCard({
  name,
  specialization,
  experience,
  pincode,
  phone,
  isAvailable,
  photoUrl,
  initials,
  id,
  index = 1,
}: SampleNurseCardProps) {
  return (
    <Card
      className="overflow-hidden card-shadow border-border hover:shadow-md transition-shadow duration-200"
      data-ocid={`nurses.item.${index}`}
    >
      <CardContent className="p-0">
        <Link to="/nurses/$id" params={{ id }} className="block">
          <div className="relative h-48 bg-secondary flex items-center justify-center overflow-hidden">
            <Avatar className="w-32 h-32">
              <AvatarImage src={photoUrl} alt={name} className="object-cover" />
              <AvatarFallback className="text-3xl font-bold bg-primary text-primary-foreground">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="absolute top-3 right-3">
              <Badge
                className={
                  isAvailable
                    ? "bg-accent text-accent-foreground"
                    : "bg-muted text-muted-foreground"
                }
              >
                {isAvailable ? "Available" : "Unavailable"}
              </Badge>
            </div>
          </div>
        </Link>
        <div className="p-4">
          <Link to="/nurses/$id" params={{ id }}>
            <h3 className="font-semibold text-lg text-foreground hover:text-primary transition-colors">
              {name}
            </h3>
          </Link>
          <p className="text-muted-foreground text-sm mt-0.5">
            {specialization}
          </p>
          <div className="flex flex-col gap-1.5 mt-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock size={14} className="text-primary" />
              <span>{experience} years experience</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin size={14} className="text-primary" />
              <span>Pincode: {pincode}</span>
            </div>
          </div>
          <a
            href={`tel:${phone}`}
            className="mt-4 flex items-center justify-center gap-2 w-full py-2.5 rounded-lg call-btn font-semibold text-sm transition-colors"
            data-ocid={`nurses.button.${index}`}
          >
            <Phone size={16} />
            Call Now
          </a>
        </div>
      </CardContent>
    </Card>
  );
}
