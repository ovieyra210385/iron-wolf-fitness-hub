import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabaseClient";

export function Settings() {
  // Configuración editable desde Supabase
  const [config, setConfig] = useState({
    gymName: "",
    address: "",
    phone: "",
    email: "",
    currency: "MXN",
    theme: "default"
  });
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchConfig = async () => {
      setLoading(true);
      const { data, error } = await supabase.from("settings").select("*").single();
      if (!error && data) setConfig(data);
      setLoading(false);
    };
    fetchConfig();
  }, []);

  const handleInput = (e) => {
    setConfig({ ...config, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    // Si existe id, actualiza; si no, inserta
    if (config.id) {
      await supabase.from("settings").update(config).eq("id", config.id);
    } else {
      await supabase.from("settings").insert([config]);
    }
    setEditing(false);
    setSaving(false);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Configuración General</CardTitle>
          <CardDescription>Personaliza los datos y preferencias de tu gimnasio.</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center text-muted-foreground">Cargando configuración...</div>
          ) : editing ? (
            <form className="space-y-4" onSubmit={handleSave}>
              <Input name="gymName" value={config.gymName} onChange={handleInput} placeholder="Nombre del gimnasio" />
              <Input name="address" value={config.address} onChange={handleInput} placeholder="Dirección" />
              <Input name="phone" value={config.phone} onChange={handleInput} placeholder="Teléfono" />
              <Input name="email" value={config.email} onChange={handleInput} placeholder="Email" />
              <Input name="currency" value={config.currency} onChange={handleInput} placeholder="Moneda" />
              <Input name="theme" value={config.theme} onChange={handleInput} placeholder="Tema" />
              <Button type="submit" className="w-full" disabled={saving}>{saving ? "Guardando..." : "Guardar"}</Button>
            </form>
          ) : (
            <div className="space-y-2">
              <div><strong>Nombre:</strong> {config.gymName}</div>
              <div><strong>Dirección:</strong> {config.address}</div>
              <div><strong>Teléfono:</strong> {config.phone}</div>
              <div><strong>Email:</strong> {config.email}</div>
              <div><strong>Moneda:</strong> {config.currency}</div>
              <div><strong>Tema:</strong> {config.theme}</div>
              <Button className="mt-4 w-full" onClick={() => setEditing(true)}>Editar</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
