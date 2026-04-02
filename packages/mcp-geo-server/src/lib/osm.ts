export async function fetchCityGeometry(cityName: string) {
  // Buscamos la ciudad y pedimos el GeoJSON explícitamente
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(cityName)}&format=json&polygon_geojson=1&limit=1`;

  const response = await fetch(url, {
    headers: { "User-Agent": "BuscoHuella-MCP-Agent/1.0" },
  });

  if (!response.ok)
    throw new Error("Error conectando con el servicio geográfico");

  const data = (await response.json()) as any[];

  if (!data || data.length === 0 || !data[0].geojson) {
    throw new Error(`No se encontró geometría GeoJSON para: ${cityName}`);
  }

  // Devolvemos solo el objeto geojson (el polígono)
  return data[0].geojson;
}
