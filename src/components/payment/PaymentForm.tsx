import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { CreditCard, Shield, Lock } from 'lucide-react';
import { toast } from 'sonner';

interface PaymentFormProps {
  total: number;
  onPaymentSuccess: (paymentData: any) => void;
  onCancel: () => void;
}

export function PaymentForm({ total, onPaymentSuccess, onCancel }: PaymentFormProps) {
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    // Bank transfer details
    accountNumber: '',
    bankName: '',
    // EFT details
    eftReference: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Format card number
    if (name === 'cardNumber') {
      const formatted = value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim();
      if (formatted.replace(/\s/g, '').length <= 16) {
        setFormData({ ...formData, [name]: formatted });
      }
      return;
    }
    
    // Format expiry date
    if (name === 'expiryDate') {
      const formatted = value.replace(/\D/g, '').replace(/(\d{2})(\d{2})/, '$1/$2');
      if (formatted.length <= 5) {
        setFormData({ ...formData, [name]: formatted });
      }
      return;
    }
    
    // Format CVV
    if (name === 'cvv') {
      if (value.length <= 4 && /^\d*$/.test(value)) {
        setFormData({ ...formData, [name]: value });
      }
      return;
    }
    
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate payment processing
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const paymentData = {
        method: paymentMethod,
        amount: total,
        reference: `PAY-${Date.now()}`,
        timestamp: new Date().toISOString(),
        ...formData
      };

      toast.success('Payment processed successfully!');
      onPaymentSuccess(paymentData);
    } catch (error) {
      toast.error('Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const paymentMethods = [
    { value: 'card', label: 'Credit/Debit Card' },
    { value: 'eft', label: 'EFT Transfer' },
    { value: 'bank', label: 'Direct Bank Transfer' },
    { value: 'snapscan', label: 'SnapScan' },
    { value: 'ozow', label: 'Ozow' },
    { value: 'cod', label: 'Cash on Delivery' }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Lock className="h-5 w-5 mr-2 text-green-600" />
            Secure Payment
          </CardTitle>
          <div className="flex items-center text-sm text-gray-600">
            <Shield className="h-4 w-4 mr-1" />
            Your payment is secured with 256-bit SSL encryption
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Order Summary */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="mb-2">Order Total</h3>
              <div className="flex justify-between items-center text-lg">
                <span>Total Amount:</span>
                <span className="text-green-600">R{total.toFixed(2)}</span>
              </div>
            </div>

            {/* Payment Method Selection */}
            <div className="space-y-2">
              <Label htmlFor="paymentMethod">Payment Method</Label>
              <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                <SelectTrigger>
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  {paymentMethods.map((method) => (
                    <SelectItem key={method.value} value={method.value}>
                      {method.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Card Payment Form */}
            {paymentMethod === 'card' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="cardholderName">Cardholder Name</Label>
                  <Input
                    id="cardholderName"
                    name="cardholderName"
                    value={formData.cardholderName}
                    onChange={handleInputChange}
                    placeholder="John Doe"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <div className="relative">
                    <Input
                      id="cardNumber"
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={handleInputChange}
                      placeholder="1234 5678 9012 3456"
                      required
                    />
                    <CreditCard className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expiryDate">Expiry Date</Label>
                    <Input
                      id="expiryDate"
                      name="expiryDate"
                      value={formData.expiryDate}
                      onChange={handleInputChange}
                      placeholder="MM/YY"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cvv">CVV</Label>
                    <Input
                      id="cvv"
                      name="cvv"
                      value={formData.cvv}
                      onChange={handleInputChange}
                      placeholder="123"
                      required
                    />
                  </div>
                </div>
              </>
            )}

            {/* EFT Payment Form */}
            {paymentMethod === 'eft' && (
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="mb-2">EFT Payment Instructions</h4>
                  <p className="text-sm text-gray-600 mb-2">
                    Please use the following reference when making your EFT payment:
                  </p>
                  <div className="bg-white p-2 rounded border">
                    <strong>EFT-{Date.now().toString().slice(-6)}</strong>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="eftReference">Payment Reference (Optional)</Label>
                  <Input
                    id="eftReference"
                    name="eftReference"
                    value={formData.eftReference}
                    onChange={handleInputChange}
                    placeholder="Your reference number"
                  />
                </div>
              </div>
            )}

            {/* Bank Transfer Form */}
            {paymentMethod === 'bank' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="bankName">Bank Name</Label>
                  <Select value={formData.bankName} onValueChange={(value) => setFormData({...formData, bankName: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your bank" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="absa">ABSA</SelectItem>
                      <SelectItem value="fnb">FNB</SelectItem>
                      <SelectItem value="nedbank">Nedbank</SelectItem>
                      <SelectItem value="standard">Standard Bank</SelectItem>
                      <SelectItem value="capitec">Capitec</SelectItem>
                      <SelectItem value="investec">Investec</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="accountNumber">Account Number</Label>
                  <Input
                    id="accountNumber"
                    name="accountNumber"
                    value={formData.accountNumber}
                    onChange={handleInputChange}
                    placeholder="Your account number"
                    required
                  />
                </div>
              </>
            )}

            {/* SnapScan/Ozow */}
            {(paymentMethod === 'snapscan' || paymentMethod === 'ozow') && (
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <p className="text-sm text-gray-600 mb-2">
                  You will be redirected to {paymentMethod === 'snapscan' ? 'SnapScan' : 'Ozow'} to complete your payment.
                </p>
                <div className="text-lg">R{total.toFixed(2)}</div>
              </div>
            )}

            {/* Cash on Delivery */}
            {paymentMethod === 'cod' && (
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h4 className="mb-2">Cash on Delivery</h4>
                <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
                  <li>Please prepare the exact amount: <strong>R{total.toFixed(2)}</strong>.</li>
                  <li>Our driver will contact you prior to delivery.</li>
                  <li>Have cash ready at delivery, or arrange EFT with the driver if available.</li>
                </ul>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex space-x-2 pt-4">
              <Button
                type="submit"
                className="flex-1"
                disabled={isProcessing}
              >
                {isProcessing
                  ? 'Processing...'
                  : paymentMethod === 'cod'
                    ? 'Confirm Order (Pay on Delivery)'
                    : `Pay R${total.toFixed(2)}`}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isProcessing}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}