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
        <h2 className="text-xl text-slate-900 font-medium">Exportar</h2>
      </div>

      <div className="col-span-8">
        <div className="flex gap-3 mb-8">
          <input
            className="form-check-input appearance-none h-4 w-4 border border-gray-400 rounded-sm bg-white checked:bg-indigo-600 checked:border-indigo-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
            type="checkbox"
            value=""
            {...register('verifiedUsers')}
          />
          <div>
            <h3 className="font-medium text-slate-900">Usuarios Verificados</h3>
            <p className="text-slate-700">
              Incluir usuarios que verificaron su email
            </p>
          </div>
        </div>

        <div className="flex gap-3 mb-8">
          <input
            className="form-check-input appearance-none h-4 w-4 border border-gray-400 rounded-sm bg-white checked:bg-indigo-600 checked:border-indigo-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
            type="checkbox"
            value=""
            {...register('nonVerifiedUsers')}
          />
          <div>
            <h3 className="font-medium text-slate-900">
              Usuarios no verificados
            </h3>
            <p className="text-slate-700">
              Incluir usuarios que aún no han verificado su email
            </p>
          </div>
        </div>
      </div>

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
