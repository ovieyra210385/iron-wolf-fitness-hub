import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog } from "@/components/ui/dialog";
import { DialogContent } from "@/components/ui/dialog";
import { DialogHeader } from "@/components/ui/dialog";
import { DialogTitle } from "@/components/ui/dialog";
import { DialogDescription } from "@/components/ui/dialog";

const initialProducts = [
  { id: 1, name: "Proteína Whey", price: 650, stock: 12, category: "Suplemento" },
  { id: 2, name: "Creatina Monohidratada", price: 350, stock: 8, category: "Suplemento" },
  { id: 3, name: "Guantes de Gimnasio", price: 220, stock: 15, category: "Accesorio" },
  { id: 4, name: "Shaker 700ml", price: 120, stock: 20, category: "Accesorio" },
  { id: 5, name: "Pre-entreno", price: 400, stock: 10, category: "Suplemento" }
];

export function POS() {
  const [products, setProducts] = useState(initialProducts);
  const [cart, setCart] = useState([]);
  const [showCheckout, setShowCheckout] = useState(false);
  const [sales, setSales] = useState([]);

  const addToCart = (product) => {
    setCart((prev) => {
      const exists = prev.find((p) => p.id === product.id);
      if (exists) {
        return prev.map((p) => p.id === product.id ? { ...p, qty: p.qty + 1 } : p);
      }
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((p) => p.id !== id));
  };

  const handleCheckout = () => {
    setSales((prev) => [
      {
        date: new Date().toLocaleString(),
        items: cart,
        total: cart.reduce((sum, p) => sum + p.price * p.qty, 0)
      },
      ...prev
    ]);
    setCart([]);
    setShowCheckout(false);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Catálogo de Productos</CardTitle>
          <CardDescription>Suplementos y accesorios disponibles</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((product) => (
              <div key={product.id} className="border rounded-lg p-4 flex flex-col items-center">
                <span className="font-bold text-lg">{product.name}</span>
                <span className="text-sm text-muted-foreground mb-2">{product.category}</span>
                <span className="text-xl font-bold mb-2">${product.price}</span>
                <Badge variant={product.stock > 0 ? "default" : "destructive"}>
                  {product.stock > 0 ? `Stock: ${product.stock}` : "Agotado"}
                </Badge>
                <Button className="mt-2 w-full" disabled={product.stock === 0} onClick={() => addToCart(product)}>
                  Agregar al carrito
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Carrito de Compras</CardTitle>
          <CardDescription>Productos seleccionados</CardDescription>
        </CardHeader>
        <CardContent>
          {cart.length === 0 ? (
            <div className="text-muted-foreground">El carrito está vacío.</div>
          ) : (
            <div className="space-y-2">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center justify-between border-b pb-2">
                  <span>{item.name} x{item.qty}</span>
                  <span>${item.price * item.qty}</span>
                  <Button size="sm" variant="outline" onClick={() => removeFromCart(item.id)}>
                    Quitar
                  </Button>
                </div>
              ))}
              <div className="font-bold text-right mt-2">
                Total: ${cart.reduce((sum, p) => sum + p.price * p.qty, 0)}
              </div>
              <Button className="w-full mt-2" onClick={() => setShowCheckout(true)}>
                Proceder al pago
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal de pago */}
      <Dialog open={showCheckout} onOpenChange={setShowCheckout}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Pago</DialogTitle>
            <DialogDescription>
              ¿Deseas finalizar la compra por ${cart.reduce((sum, p) => sum + p.price * p.qty, 0)}?
            </DialogDescription>
          </DialogHeader>
          <Button className="w-full" onClick={handleCheckout}>
            Confirmar y Cobrar
          </Button>
        </DialogContent>
      </Dialog>

      <Card>
        <CardHeader>
          <CardTitle>Ventas Recientes</CardTitle>
          <CardDescription>Historial de transacciones</CardDescription>
        </CardHeader>
        <CardContent>
          {sales.length === 0 ? (
            <div className="text-muted-foreground">No hay ventas registradas.</div>
          ) : (
            <div className="space-y-2">
              {sales.map((sale, idx) => (
                <div key={idx} className="border rounded p-2">
                  <div className="font-bold">{sale.date}</div>
                  <ul className="text-sm mb-1">
                    {sale.items.map((item) => (
                      <li key={item.id}>{item.name} x{item.qty} - ${item.price * item.qty}</li>
                    ))}
                  </ul>
                  <div className="font-bold text-right">Total: ${sale.total}</div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
