import { useForm } from 'react-hook-form';

export function ExportForm() {
  const { register, handleSubmit } = useForm();

  function onSubmit(data) {
    console.log(data);
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid grid-cols-12 gap-8 border-b-2 pb-8 mb-8"
    >

      <div className="col-span-4">
        <h2 className="text-xl text-slate-900 font-medium">Formato</h2>
      </div>

      <div className="col-span-8">
        <div className="flex gap-3 mb-8">
          <select
            {...register('format')}
            className="border border-gray-300 p-2 rounded-lg w-full block"
          >
            <option>JSON</option>
            <option>CSV</option>
          </select>
        </div>
      </div>

      <div className="text-right col-span-12">
        <button className="bg-indigo-700 hover:bg-indigo-900 text-white font-medium px-8 py-4 rounded-lg">
          Exportar Waitlist
        </button>
      </div>
    </form>
  );
}
