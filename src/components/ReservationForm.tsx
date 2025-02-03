"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { ReservationFormProps, ReservationFormData } from "@/libs/types";
import { createReservation } from "@/app/actions/reservations";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export function ReservationForm({
  tableId,
  reservationDate,
  table,
}: ReservationFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<ReservationFormData>();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data: ReservationFormData) => {
    setIsSubmitting(true);
    try {
      await createReservation(tableId, reservationDate, data);
      toast({
        title: "Success",
        description: "Your reservation has been submitted successfully!",
      });
    } catch (error) {
      console.error("Error submitting reservation:", error);
      toast({
        title: "Error",
        description:
          "There was a problem submitting your reservation. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="customer_name">Name</Label>
        <Input
          id="customer_name"
          {...register("customer_name", { required: "Name is required" })}
        />
        {errors.customer_name && (
          <p className="text-red-500">{errors.customer_name.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="customer_phone">Phone</Label>
        <Input
          id="customer_phone"
          {...register("customer_phone", { required: "Phone is required" })}
        />
        {errors.customer_phone && (
          <p className="text-red-500">{errors.customer_phone.message}</p>
        )}
      </div>

      <div>
        <div className="flex items-center gap-2 mb-2">
          <Label htmlFor="customer_email">Email</Label>
          <p className="text-xs text-muted-foreground">(Optional)</p>
        </div>
        <Input
          id="customer_email"
          type="email"
          {...register("customer_email")}
        />
      </div>

      <div>
        <Label htmlFor="guest_count">Number of Guests</Label>
        <RadioGroup
          className="flex flex-wrap gap-2 mt-2"
          onValueChange={(value) => {
            setValue("guest_count", parseInt(value));
          }}
        >
          {Array.from({ length: table?.seats || 0 }, (_, index) => (
            <div className="flex items-center space-x-2" key={index}>
              <RadioGroupItem
                value={`${index + 1}`}
                id={`guest_count_${index}`}
              />
              <Label htmlFor={`guest_count_${index}`}>{index + 1}</Label>
            </div>
          ))}
        </RadioGroup>
        {errors.guest_count && (
          <p className="text-red-500">{errors.guest_count.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="time_slot">Time Slot</Label>
        <Input
          id="time_slot"
          type="time"
          {...register("time_slot", { required: "Time slot is required" })}
        />
        {errors.time_slot && (
          <p className="text-red-500">{errors.time_slot.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="optional_message">Optional Message</Label>
        <Textarea id="optional_message" {...register("optional_message")} />
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className=" bg-blue-500 hover:bg-blue-600 "
      >
        {isSubmitting ? "Submitting..." : "Submit Reservation"}
      </Button>
    </form>
  );
}
