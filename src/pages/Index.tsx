import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
}

interface CartItem extends Product {
  quantity: number;
  customText?: string;
}

const products: Product[] = [
  {
    id: 1,
    name: 'Креативная кружка',
    price: 890,
    image: 'https://cdn.poehali.dev/projects/0a56f08d-9e72-4952-9258-be467a1bad92/files/c996d5d4-3802-4dc8-9a99-52ef49bf8a5a.jpg',
    category: 'design'
  },
  {
    id: 2,
    name: 'Милая иллюстрация',
    price: 890,
    image: 'https://cdn.poehali.dev/projects/0a56f08d-9e72-4952-9258-be467a1bad92/files/59326f99-8768-4c82-84c8-4e7f5051ad38.jpg',
    category: 'cute'
  },
  {
    id: 3,
    name: 'Мотивация дня',
    price: 890,
    image: 'https://cdn.poehali.dev/projects/0a56f08d-9e72-4952-9258-be467a1bad92/files/0d0aa40a-f136-4010-97c9-b4e8af11e7f6.jpg',
    category: 'text'
  }
];

export default function Index() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customText, setCustomText] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isOrderDialogOpen, setIsOrderDialogOpen] = useState(false);
  const [orderForm, setOrderForm] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    comment: ''
  });
  const { toast } = useToast();

  const addToCart = (product: Product, text?: string) => {
    const existingItem = cart.find(item => item.id === product.id && item.customText === text);
    
    if (existingItem) {
      setCart(cart.map(item =>
        item.id === product.id && item.customText === text
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1, customText: text }]);
    }

    toast({
      title: '✨ Добавлено в корзину!',
      description: `${product.name} ${text ? 'с вашим текстом' : ''}`,
    });
  };

  const removeFromCart = (index: number) => {
    setCart(cart.filter((_, i) => i !== index));
  };

  const updateQuantity = (index: number, delta: number) => {
    setCart(cart.map((item, i) => {
      if (i === index) {
        const newQuantity = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQuantity };
      }
      return item;
    }));
  };

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleOrderSubmit = () => {
    if (!orderForm.name || !orderForm.phone || !orderForm.address) {
      toast({
        title: '⚠️ Заполните обязательные поля',
        description: 'Укажите ФИО, телефон и адрес доставки',
        variant: 'destructive'
      });
      return;
    }

    toast({
      title: '🎉 Заказ оформлен!',
      description: `Спасибо, ${orderForm.name}! Мы свяжемся с вами в ближайшее время.`,
    });

    setCart([]);
    setOrderForm({ name: '', phone: '', email: '', address: '', comment: '' });
    setIsOrderDialogOpen(false);
  };

  return (
    <div className="min-h-screen">
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-3xl font-display font-bold text-primary">
            ☕ Кружки.ру
          </h1>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="lg" className="relative hover:scale-105 transition-transform">
                <Icon name="ShoppingCart" size={20} />
                {cart.length > 0 && (
                  <Badge className="absolute -top-2 -right-2 bg-secondary text-secondary-foreground">
                    {cart.reduce((sum, item) => sum + item.quantity, 0)}
                  </Badge>
                )}
                <span className="ml-2">Корзина</span>
              </Button>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-lg">
              <SheetHeader>
                <SheetTitle className="font-display text-2xl">Ваша корзина</SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-4">
                {cart.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <Icon name="ShoppingBag" size={48} className="mx-auto mb-4 opacity-50" />
                    <p>Корзина пуста</p>
                  </div>
                ) : (
                  <>
                    {cart.map((item, index) => (
                      <Card key={index} className="overflow-hidden">
                        <CardContent className="p-4 flex gap-4">
                          <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-lg" />
                          <div className="flex-1">
                            <h3 className="font-semibold">{item.name}</h3>
                            {item.customText && (
                              <p className="text-sm text-muted-foreground mt-1">"{item.customText}"</p>
                            )}
                            <div className="flex items-center justify-between mt-2">
                              <div className="flex items-center gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => updateQuantity(index, -1)}
                                  className="h-7 w-7 p-0"
                                >
                                  <Icon name="Minus" size={14} />
                                </Button>
                                <span className="font-semibold w-8 text-center">{item.quantity}</span>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => updateQuantity(index, 1)}
                                  className="h-7 w-7 p-0"
                                >
                                  <Icon name="Plus" size={14} />
                                </Button>
                              </div>
                              <div className="text-right">
                                <p className="font-bold text-primary">{item.price * item.quantity} ₽</p>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => removeFromCart(index)}
                                  className="text-destructive hover:text-destructive h-auto p-0"
                                >
                                  <Icon name="Trash2" size={14} />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    <div className="border-t pt-4 mt-4">
                      <div className="flex justify-between text-xl font-bold mb-4">
                        <span>Итого:</span>
                        <span className="text-primary">{totalPrice} ₽</span>
                      </div>
                      <Button 
                        size="lg" 
                        className="w-full animate-bounce-in bg-primary hover:bg-primary/90"
                        onClick={() => setIsOrderDialogOpen(true)}
                      >
                        Оформить заказ
                        <Icon name="ArrowRight" size={20} className="ml-2" />
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>

      <section className="py-20 bg-gradient-to-br from-accent via-muted to-accent/50">
        <div className="container mx-auto px-4 text-center">
          <div className="animate-fade-in">
            <Badge className="mb-4 text-lg px-4 py-2 bg-secondary">✨ Создай свой дизайн</Badge>
            <h2 className="font-display text-5xl md:text-7xl font-bold text-foreground mb-6">
              Кружки с вашим
              <span className="block text-primary mt-2">характером! 🎨</span>
            </h2>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Напечатаем любой текст или выберите из готовых дизайнов
            </p>
            <Button size="lg" className="text-lg px-8 py-6 animate-bounce-in bg-primary hover:bg-primary/90">
              Начать создавать
              <Icon name="Sparkles" size={20} className="ml-2" />
            </Button>
          </div>
        </div>
      </section>

      <section id="catalog" className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="font-display text-4xl font-bold text-center mb-12">
            Наши дизайны 🎉
          </h2>
          
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-4 mb-8">
              <TabsTrigger value="all">Все</TabsTrigger>
              <TabsTrigger value="design">Дизайн</TabsTrigger>
              <TabsTrigger value="cute">Милые</TabsTrigger>
              <TabsTrigger value="text">Текст</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product, index) => (
                <Card key={product.id} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 animate-fade-in" style={{animationDelay: `${index * 0.1}s`}}>
                  <CardContent className="p-0">
                    <div className="relative overflow-hidden rounded-t-lg">
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <Badge className="absolute top-4 right-4 bg-secondary">{product.price} ₽</Badge>
                    </div>
                    <div className="p-6">
                      <h3 className="font-display text-2xl font-semibold mb-4">{product.name}</h3>
                      <div className="space-y-2">
                        <Button 
                          onClick={() => addToCart(product)} 
                          className="w-full bg-primary hover:bg-primary/90"
                        >
                          <Icon name="ShoppingCart" size={18} className="mr-2" />
                          Добавить в корзину
                        </Button>
                        <Sheet>
                          <SheetTrigger asChild>
                            <Button 
                              variant="outline" 
                              className="w-full"
                              onClick={() => setSelectedProduct(product)}
                            >
                              <Icon name="Pencil" size={18} className="mr-2" />
                              Добавить свой текст
                            </Button>
                          </SheetTrigger>
                          <SheetContent>
                            <SheetHeader>
                              <SheetTitle className="font-display">Персонализация</SheetTitle>
                            </SheetHeader>
                            <div className="mt-6 space-y-4">
                              <img src={product.image} alt={product.name} className="w-full rounded-lg" />
                              <div>
                                <label className="font-semibold mb-2 block">Ваш текст:</label>
                                <Textarea 
                                  placeholder="Напишите что угодно..."
                                  value={customText}
                                  onChange={(e) => setCustomText(e.target.value)}
                                  className="min-h-24"
                                />
                              </div>
                              <Button 
                                onClick={() => {
                                  if (selectedProduct && customText.trim()) {
                                    addToCart(selectedProduct, customText);
                                    setCustomText('');
                                  }
                                }}
                                disabled={!customText.trim()}
                                className="w-full bg-primary"
                                size="lg"
                              >
                                Добавить с текстом
                              </Button>
                            </div>
                          </SheetContent>
                        </Sheet>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            {['design', 'cute', 'text'].map(category => (
              <TabsContent key={category} value={category} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {products.filter(p => p.category === category).map((product, index) => (
                  <Card key={product.id} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 animate-fade-in" style={{animationDelay: `${index * 0.1}s`}}>
                    <CardContent className="p-0">
                      <div className="relative overflow-hidden rounded-t-lg">
                        <img 
                          src={product.image} 
                          alt={product.name} 
                          className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <Badge className="absolute top-4 right-4 bg-secondary">{product.price} ₽</Badge>
                      </div>
                      <div className="p-6">
                        <h3 className="font-display text-2xl font-semibold mb-4">{product.name}</h3>
                        <div className="space-y-2">
                          <Button 
                            onClick={() => addToCart(product)} 
                            className="w-full bg-primary hover:bg-primary/90"
                          >
                            <Icon name="ShoppingCart" size={18} className="mr-2" />
                            Добавить в корзину
                          </Button>
                          <Sheet>
                            <SheetTrigger asChild>
                              <Button 
                                variant="outline" 
                                className="w-full"
                                onClick={() => setSelectedProduct(product)}
                              >
                                <Icon name="Pencil" size={18} className="mr-2" />
                                Добавить свой текст
                              </Button>
                            </SheetTrigger>
                            <SheetContent>
                              <SheetHeader>
                                <SheetTitle className="font-display">Персонализация</SheetTitle>
                              </SheetHeader>
                              <div className="mt-6 space-y-4">
                                <img src={product.image} alt={product.name} className="w-full rounded-lg" />
                                <div>
                                  <label className="font-semibold mb-2 block">Ваш текст:</label>
                                  <Textarea 
                                    placeholder="Напишите что угодно..."
                                    value={customText}
                                    onChange={(e) => setCustomText(e.target.value)}
                                    className="min-h-24"
                                  />
                                </div>
                                <Button 
                                  onClick={() => {
                                    if (selectedProduct && customText.trim()) {
                                      addToCart(selectedProduct, customText);
                                      setCustomText('');
                                    }
                                  }}
                                  disabled={!customText.trim()}
                                  className="w-full bg-primary"
                                  size="lg"
                                >
                                  Добавить с текстом
                                </Button>
                              </div>
                            </SheetContent>
                          </Sheet>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>

      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
              <h2 className="font-display text-4xl font-bold mb-6">
                Доставка и оплата 🚚
              </h2>
              <div className="space-y-4">
                <Card>
                  <CardContent className="p-6 flex items-start gap-4">
                    <Icon name="Truck" size={32} className="text-primary flex-shrink-0" />
                    <div>
                      <h3 className="font-bold text-lg mb-2">Быстрая доставка</h3>
                      <p className="text-muted-foreground">По Москве — 1-2 дня, по России — 3-5 дней</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 flex items-start gap-4">
                    <Icon name="CreditCard" size={32} className="text-primary flex-shrink-0" />
                    <div>
                      <h3 className="font-bold text-lg mb-2">Удобная оплата</h3>
                      <p className="text-muted-foreground">Картой онлайн или наличными при получении</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 flex items-start gap-4">
                    <Icon name="PackageCheck" size={32} className="text-primary flex-shrink-0" />
                    <div>
                      <h3 className="font-bold text-lg mb-2">Гарантия качества</h3>
                      <p className="text-muted-foreground">Печать не выцветает и не смывается</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
            <div className="animate-fade-in" style={{animationDelay: '0.2s'}}>
              <h2 className="font-display text-4xl font-bold mb-6">
                Контакты 📞
              </h2>
              <Card>
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <Icon name="Phone" size={24} className="text-primary" />
                    <div>
                      <p className="font-semibold">Телефон</p>
                      <a href="tel:+79001234567" className="text-primary hover:underline">+7 (900) 123-45-67</a>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Icon name="Mail" size={24} className="text-primary" />
                    <div>
                      <p className="font-semibold">Email</p>
                      <a href="mailto:info@kruzhki.ru" className="text-primary hover:underline">info@kruzhki.ru</a>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Icon name="MapPin" size={24} className="text-primary" />
                    <div>
                      <p className="font-semibold">Адрес</p>
                      <p className="text-muted-foreground">г. Москва, ул. Примерная, 123</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 pt-4 border-t">
                    <Icon name="Clock" size={24} className="text-primary" />
                    <div>
                      <p className="font-semibold">Режим работы</p>
                      <p className="text-muted-foreground">Пн-Пт: 9:00-20:00<br/>Сб-Вс: 10:00-18:00</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-foreground text-background py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="font-display text-2xl font-bold mb-2">☕ Кружки.ру</p>
          <p className="text-sm opacity-75">© 2024 Все права защищены</p>
        </div>
      </footer>

      <Dialog open={isOrderDialogOpen} onOpenChange={setIsOrderDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl">Оформление заказа</DialogTitle>
            <DialogDescription>
              Заполните данные для доставки вашего заказа
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">ФИО <span className="text-destructive">*</span></Label>
              <Input
                id="name"
                placeholder="Иванов Иван Иванович"
                value={orderForm.name}
                onChange={(e) => setOrderForm({ ...orderForm, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Телефон <span className="text-destructive">*</span></Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+7 (900) 123-45-67"
                value={orderForm.phone}
                onChange={(e) => setOrderForm({ ...orderForm, phone: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="example@mail.ru"
                value={orderForm.email}
                onChange={(e) => setOrderForm({ ...orderForm, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Адрес доставки <span className="text-destructive">*</span></Label>
              <Textarea
                id="address"
                placeholder="Город, улица, дом, квартира"
                value={orderForm.address}
                onChange={(e) => setOrderForm({ ...orderForm, address: e.target.value })}
                className="min-h-20"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="comment">Комментарий к заказу</Label>
              <Textarea
                id="comment"
                placeholder="Уточнения по заказу или доставке"
                value={orderForm.comment}
                onChange={(e) => setOrderForm({ ...orderForm, comment: e.target.value })}
                className="min-h-20"
              />
            </div>
            <div className="border-t pt-4">
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-semibold">Товаров в заказе:</span>
                <span className="text-lg">{cart.reduce((sum, item) => sum + item.quantity, 0)} шт.</span>
              </div>
              <div className="flex justify-between items-center mb-6">
                <span className="text-2xl font-bold">Итого:</span>
                <span className="text-2xl font-bold text-primary">{totalPrice} ₽</span>
              </div>
              <Button 
                size="lg" 
                className="w-full bg-primary hover:bg-primary/90"
                onClick={handleOrderSubmit}
              >
                Подтвердить заказ
                <Icon name="Check" size={20} className="ml-2" />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}