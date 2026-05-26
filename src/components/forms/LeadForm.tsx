import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { useState } from 'react';
import AnimatedInput from '../ui/AnimatedInput';
import AnimatedTextarea from '../ui/AnimatedTextarea';
import RadioGroup, { type RadioOption } from '../ui/RadioGroup';
import Checkbox from '../ui/Checkbox';
import FlySendButton from '../ui/FlySendButton';
import { submitLeadToGHL } from '../../lib/ghl';

export interface LeadFormStrings {
  form: {
    name: string;
    email: string;
    phone: string;
    phoneHint: string;
    reasonLabel: string;
    reasons: { consult: string; secondOpinion: string; followUp: string; other: string };
    message: string;
    messagePlaceholder: string;
    consent: string;
    consentDescription: string;
    submit: string;
    submitting: string;
  };
  validation: {
    nameRequired: string;
    emailInvalid: string;
    phoneInvalid: string;
    reasonRequired: string;
    messageTooShort: string;
    consentRequired: string;
  };
  toast: { success: string; error: string };
}

interface LeadFormProps {
  strings: LeadFormStrings;
  language: 'en' | 'es';
}

const REASONS = ['consult', 'secondOpinion', 'followUp', 'other'] as const;
type Reason = (typeof REASONS)[number];

export default function LeadForm({ strings, language }: LeadFormProps) {
  const [submitted, setSubmitted] = useState(false);

  const schema = z.object({
    name: z.string().trim().min(2, strings.validation.nameRequired),
    email: z.string().trim().email(strings.validation.emailInvalid),
    phone: z
      .string()
      .trim()
      .regex(/^[+\d\s()\-.]{7,}$/, strings.validation.phoneInvalid),
    reason: z.enum(REASONS, { message: strings.validation.reasonRequired }),
    message: z.string().trim().min(10, strings.validation.messageTooShort).max(2000),
    consent: z.literal(true, { message: strings.validation.consentRequired }),
  });
  type FormValues = z.infer<typeof schema>;

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      reason: undefined as unknown as Reason,
      message: '',
      consent: false as unknown as true,
    },
  });

  const reasonOptions: RadioOption[] = [
    { value: 'consult', label: strings.form.reasons.consult },
    { value: 'secondOpinion', label: strings.form.reasons.secondOpinion },
    { value: 'followUp', label: strings.form.reasons.followUp },
    { value: 'other', label: strings.form.reasons.other },
  ];

  async function onSubmit(values: FormValues) {
    try {
      await submitLeadToGHL({
        ...values,
        source: 'wasatch-orthopedic.com/contact',
        language,
        submittedAt: new Date().toISOString(),
      });
      toast.success(strings.toast.success);
      reset();
      setSubmitted(true);
    } catch (err) {
      console.error('[LeadForm] submission error', err);
      toast.error(strings.toast.error);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-10" noValidate>
      <div className="grid gap-10 md:grid-cols-2">
        <AnimatedInput
          label={strings.form.name}
          required
          autoComplete="name"
          error={errors.name?.message}
          {...register('name')}
        />
        <AnimatedInput
          label={strings.form.email}
          type="email"
          required
          autoComplete="email"
          error={errors.email?.message}
          {...register('email')}
        />
      </div>

      <AnimatedInput
        label={strings.form.phone}
        type="tel"
        required
        autoComplete="tel"
        hint={strings.form.phoneHint}
        error={errors.phone?.message}
        {...register('phone')}
      />

      <Controller
        name="reason"
        control={control}
        render={({ field }) => (
          <RadioGroup
            label={strings.form.reasonLabel}
            options={reasonOptions}
            required
            value={field.value}
            onValueChange={field.onChange}
            error={errors.reason?.message}
          />
        )}
      />

      <AnimatedTextarea
        label={strings.form.message}
        placeholder={strings.form.messagePlaceholder}
        required
        error={errors.message?.message}
        {...register('message')}
      />

      <Controller
        name="consent"
        control={control}
        render={({ field }) => (
          <div>
            <Checkbox
              label={strings.form.consent}
              description={strings.form.consentDescription}
              required
              checked={Boolean(field.value)}
              onCheckedChange={(c) => field.onChange(c)}
            />
            {errors.consent?.message && (
              <p className="mt-2 ml-8 text-xs text-[var(--color-danger)]">
                {errors.consent.message}
              </p>
            )}
          </div>
        )}
      />

      <div className="pt-2">
        <FlySendButton type="submit" disabled={isSubmitting}>
          {isSubmitting ? strings.form.submitting : strings.form.submit}
        </FlySendButton>
        {submitted && !isSubmitting && (
          <p className="mt-4 text-sm text-[var(--color-accent)]" role="status">
            {strings.toast.success}
          </p>
        )}
      </div>
    </form>
  );
}
