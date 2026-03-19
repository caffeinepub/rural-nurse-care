import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useSearch } from "@tanstack/react-router";
import { Search, SlidersHorizontal, UserX } from "lucide-react";
import { useEffect, useState } from "react";
import { NurseCard } from "../components/NurseCard";
import { useFilterByPincode, useListAllNurses } from "../hooks/useQueries";

const SKELETON_IDS = ["sk-1", "sk-2", "sk-3", "sk-4", "sk-5", "sk-6"];

export function NursesPage() {
  const searchParams = useSearch({ strict: false }) as { pincode?: string };
  const [pincode, setPincode] = useState(searchParams.pincode || "");
  const [activeFilter, setActiveFilter] = useState(searchParams.pincode || "");

  useEffect(() => {
    if (searchParams.pincode) {
      setPincode(searchParams.pincode);
      setActiveFilter(searchParams.pincode);
    }
  }, [searchParams.pincode]);

  const { data: allNurses, isLoading: loadingAll } = useListAllNurses();
  const { data: filteredNurses, isLoading: loadingFiltered } =
    useFilterByPincode(activeFilter);

  const isFiltered = activeFilter.length === 6;
  const nurses = isFiltered ? filteredNurses : allNurses;
  const isLoading = isFiltered ? loadingFiltered : loadingAll;

  const handleSearch = () => {
    setActiveFilter(pincode);
  };

  const handleClear = () => {
    setPincode("");
    setActiveFilter("");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">
          Find a Nurse
        </h1>
        <p className="mt-1 text-muted-foreground">
          Browse our network of verified home care nurses
        </p>
      </div>

      {/* Filter bar */}
      <div
        className="bg-card border border-border rounded-xl p-4 mb-8 shadow-xs"
        data-ocid="nurses.panel"
      >
        <div className="flex items-center gap-2 mb-3">
          <SlidersHorizontal size={16} className="text-primary" />
          <span className="text-sm font-medium text-foreground">
            Filter by Pincode
          </span>
        </div>
        <div className="flex gap-2">
          <div className="flex-1 flex items-center gap-2 border border-border rounded-lg px-3 bg-background">
            <Search size={16} className="text-muted-foreground" />
            <Input
              value={pincode}
              onChange={(e) =>
                setPincode(e.target.value.replace(/\D/g, "").slice(0, 6))
              }
              placeholder="Enter 6-digit Pincode"
              className="border-0 shadow-none focus-visible:ring-0 p-0 h-10"
              maxLength={6}
              inputMode="numeric"
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              data-ocid="nurses.search_input"
            />
          </div>
          <Button
            onClick={handleSearch}
            className="bg-primary text-primary-foreground"
            data-ocid="nurses.primary_button"
          >
            Search
          </Button>
          {activeFilter && (
            <Button
              variant="outline"
              onClick={handleClear}
              data-ocid="nurses.secondary_button"
            >
              Clear
            </Button>
          )}
        </div>
        {isFiltered && (
          <p className="mt-2 text-xs text-muted-foreground">
            Showing results for pincode: <strong>{activeFilter}</strong>
          </p>
        )}
      </div>

      {/* Results */}
      {isLoading ? (
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
          data-ocid="nurses.loading_state"
        >
          {SKELETON_IDS.map((skId) => (
            <div
              key={skId}
              className="bg-card rounded-xl overflow-hidden border border-border"
            >
              <Skeleton className="h-48 w-full" />
              <div className="p-4 space-y-2">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-10 w-full mt-2" />
              </div>
            </div>
          ))}
        </div>
      ) : nurses && nurses.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {nurses.map((nurse, i) => (
            <NurseCard key={nurse.id} nurse={nurse} index={i + 1} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16" data-ocid="nurses.empty_state">
          <UserX size={48} className="mx-auto text-muted-foreground mb-4" />
          <h3 className="font-semibold text-lg text-foreground mb-1">
            {isFiltered
              ? "No registered nurses found in this area"
              : "No nurses registered yet"}
          </h3>
          <p className="text-muted-foreground text-sm">
            {isFiltered
              ? `No nurse has registered for pincode ${activeFilter}. Please try a different pincode.`
              : "Be the first to register as a nurse and help your community."}
          </p>
          {isFiltered && (
            <Button
              variant="outline"
              onClick={handleClear}
              className="mt-4"
              data-ocid="nurses.secondary_button"
            >
              Show All Nurses
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
