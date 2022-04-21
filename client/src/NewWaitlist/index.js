import { NewWaitlistForm } from './NewWaitlistForm';

export function NewWaitlist() {
  return (
    <section>
      <h2 className="text-lg font-medium text-slate-900 mb-10">
        Crear nueva Waitlist
      </h2>

      <NewWaitlistForm />
    </section>
  );
}
