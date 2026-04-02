"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

export function useGeoHierarchy(
  onCityChange?: (id: string | null, name: string | null) => void,
) {
  const [data, setData] = useState<any>({
    countries: [],
    regions: [],
    provinces: [],
    cities: [],
  });
  const [sel, setSel] = useState({
    country: "",
    region: "",
    province: "",
    city: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase
      .from("jurisdictions")
      .select("id, name")
      .in("type", ["country", "COUNTRY"])
      .order("name")
      .then(({ data: d }) =>
        setData((prev: any) => ({ ...prev, countries: d || [] })),
      );
  }, []);

  useEffect(() => {
    if (!sel.country) return;
    setLoading(true);
    supabase
      .from("jurisdictions")
      .select("id, name")
      .eq("parent_id", sel.country)
      .order("name")
      .then(({ data: d }) => {
        setData((prev: any) => ({ ...prev, regions: d || [] }));
        setLoading(false);
      });
  }, [sel.country]);

  useEffect(() => {
    if (!sel.region) return;
    setLoading(true);
    supabase
      .from("jurisdictions")
      .select("id, name")
      .eq("parent_id", sel.region)
      .order("name")
      .then(({ data: d }) => {
        setData((prev: any) => ({ ...prev, provinces: d || [] }));
        setLoading(false);
      });
  }, [sel.region]);

  useEffect(() => {
    if (!sel.province) return;
    setLoading(true);
    supabase
      .from("jurisdictions")
      .select("id, name")
      .eq("parent_id", sel.province)
      .order("name")
      .then(({ data: d }) => {
        setData((prev: any) => ({ ...prev, cities: d || [] }));
        setLoading(false);
      });
  }, [sel.province]);

  useEffect(() => {
    if (!onCityChange) return;
    const finalId =
      sel.city || sel.province || sel.region || sel.country || null;
    const allNames = [
      ...data.countries,
      ...data.regions,
      ...data.provinces,
      ...data.cities,
    ];
    const finalName = allNames.find((n: any) => n.id === finalId)?.name || null;
    onCityChange(finalId, finalName);
  }, [sel, onCityChange, data]);

  return { data, sel, setSel, loading };
}
