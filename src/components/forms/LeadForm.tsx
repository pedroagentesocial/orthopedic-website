import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import AnimatedInput from '../ui/AnimatedInput';
import AnimatedTextarea from '../ui/AnimatedTextarea';
import RadioGroup, { type RadioOption } from '../ui/RadioGroup';
import Checkbox from '../ui/Checkbox';
import FlySendButton from '../ui/FlySendButton';
import SubmitDialog, { type SubmitState, type SubmitDialogStrings } from './SubmitDialog';
import { submitLead } from '../../lib/ghl';

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
    fillRequiredOne: string;
    fillRequiredMany: string;
    allComplete: string;
  };
  toast: { success: string; error: string };
  modal: SubmitDialogStrings;
}

interface LeadFormProps {
  strings: LeadFormStrings;
  language: 'en' | 'es';
}

const REASONS = ['consult', 'secondOpinion', 'followUp', 'other'] as const;
type Reason = (typeof REASONS)[number];

export default function LeadForm({ strings, language }: LeadFormProps) {
  const [submitState, setSubmitState] = useState<SubmitState>('idle');
  const [errorDetail, setErrorDetail] = useState<string | undefined>();

  // Required minimum: name + phone + consent. Email, reason and message optional.
  const schema = z.object({
    name: z.string().trim().min(2, strings.validation.nameRequired),
    phone: z
      .string()
      .trim()
      .regex(/^[+\d\s()\-.]{7,}$/, strings.validation.phoneInvalid),
    // Optional: empty string is valid; anything non-empty must be a valid email.
    email: z
      .union([z.literal(''), z.string().trim().email(strings.validation.emailInvalid).max(160)])
      .optional(),
    reason: z.enum(REASONS).optional(),
    message: z.string().trim().max(2000).optional(),
    consent: z.literal(true, { message: strings.validation.consentRequired }),
    // Honeypot — no client constraint; the server silently drops filled ones.
    company: z.string().optional(),
  });
  type FormValues = z.infer<typeof schema>;

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting, isValid },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      reason: undefined as unknown as Reason,
      message: '',
      consent: false as unknown as true,
      company: '',
    },
  });

  // Count required fields with errors (or never filled). Used for the hint.
  const missingCount = Object.keys(errors).length;

  const reasonOptions: RadioOption[] = [
    { value: 'consult', label: strings.form.reasons.consult },
    { value: 'secondOpinion', label: strings.form.reasons.secondOpinion },
    { value: 'followUp', label: strings.form.reasons.followUp },
    { value: 'other', label: strings.form.reasons.other },
  ];

  async function onSubmit(values: FormValues) {
    setSubmitState('submitting');
    setErrorDetail(undefined);
    try {
      await submitLead({
        name: values.name,
        email: values.email || undefined,
        phone: values.phone,
        reason: values.reason,
        message: values.message || undefined,
        consent: values.consent,
        company: values.company,
        language,
      });
      setSubmitState('success');
      reset();
    } catch (err) {
      console.error('[LeadForm] submission error', err);
      setErrorDetail(err instanceof Error ? err.message : 'Unknown error');
      setSubmitState('error');
    }
  }

  const hintReady = isValid;
  const hintText = hintReady
    ? strings.validation.allComplete
    : missingCount === 1
      ? strings.validation.fillRequiredOne
      : strings.validation.fillRequiredMany.replace(
          '{count}',
          missingCount > 0 ? String(missingCount) : '3',
        );

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-10" noValidate>
        {/* Honeypot — hidden from real users; bots that fill it are dropped server-side. */}
        <input
          type="text"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="hidden"
          {...register('company')}
        />

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
              value={field.value}
              onValueChange={field.onChange}
              error={errors.reason?.message}
            />
          )}
        />

        <AnimatedTextarea
          label={strings.form.message}
          placeholder={strings.form.messagePlaceholder}
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

        <div className="pt-2 space-y-4">
          <p
            className={hintReady ? 'lf-hint lf-hint--ready' : 'lf-hint'}
            role="status"
            aria-live="polite"
          >
            <span className="lf-hint-dot" aria-hidden="true" />
            {hintText}
          </p>
          <FlySendButton type="submit" disabled={isSubmitting || !isValid}>
            {isSubmitting ? strings.form.submitting : strings.form.submit}
          </FlySendButton>
        </div>
      </form>

      <SubmitDialog
        state={submitState}
        errorDetail={errorDetail}
        strings={strings.modal}
        onClose={() => setSubmitState('idle')}
        onRetry={() => setSubmitState('idle')}
      />
    </>
  );
}
