import React from 'react';

import { Label } from '@shared/components/ui/form/label';
import { Textarea } from '@shared/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@shared/components/ui/select';
import { OrderStatus, UpdateOrderDto } from '@wedding/api-types';

interface EditOrderFormFieldsProps {
  order: Partial<UpdateOrderDto & { id?: number }>;
  setOrder: React.Dispatch<React.SetStateAction<Partial<UpdateOrderDto & { id?: number }>>>;
}

const capitalizeFirst = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

export const getEditOrderFormFields = ({ order, setOrder }: EditOrderFormFieldsProps) => [
  <div key="orderStatus" className="md:col-span-1">
    <div className="mt-4 gap-2 flex flex-col">
      <Label htmlFor="orderStatus">Order Status</Label>
      <Select
        value={order.orderStatus || ''}
        onValueChange={(value: OrderStatus) => setOrder({ ...order, orderStatus: value })}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select order status" />
        </SelectTrigger>
        <SelectContent>
          {Object.values(OrderStatus).map((status) => (
            <SelectItem key={status} value={status}>
              {capitalizeFirst(status.toLowerCase())}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  </div>,

  <div key="remark" className="md:col-span-1">
    <div className="mt-4 gap-2 flex flex-col">
      <Label htmlFor="remark">Remarks</Label>
      <Textarea
        id="remark"
        value={order.remark || ''}
        onChange={(e) => setOrder({ ...order, remark: e.target.value })}
        placeholder="Enter any remarks about this order"
        rows={4}
      />
    </div>
  </div>,
];
