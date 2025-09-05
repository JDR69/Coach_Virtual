// PERIFL DE USUARIO
// JOAN DR

function Perfil() {
  // Datos de ejemplo, puedes reemplazar por props o datos reales
  const user = {
    nombre: 'Vini',
    email: 'vini@email.com',
    fechaNacimiento: '2002-05-10',
    genero: 'Masculino',
    altura: '1.75 m',
    peso: '70 kg',
    rol: 'Estudiante',
    progreso: '75%',
    fechaRegistro: '2024-01-15',
    plan: 'Premium', // o 'Gratuito'
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 p-4">
      <section className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-8 max-w-lg w-full text-center border border-white/20 animate-fade-in">
        <div className="flex flex-col items-center mb-6">
          <img
            src={user.avatar}
            alt="Avatar"
            className="w-32 h-32 rounded-full border-4 border-white shadow-lg mb-4 object-cover"
          />
          <h2 className="text-3xl font-bold text-white mb-1">{user.nombre}</h2>
          <span className="text-white/60 text-sm">{user.email}</span>
        </div>
        <div className="grid grid-cols-1 gap-4 text-left mb-6">
          <div className="flex items-center justify-between bg-white/10 rounded-lg px-4 py-3">
            <span className="text-white/70 font-medium">Email:</span>
            <span className="text-white font-semibold">{user.email}</span>
          </div>
          <div className="flex items-center justify-between bg-white/10 rounded-lg px-4 py-3">
            <span className="text-white/70 font-medium">Fecha de nacimiento:</span>
            <span className="text-white font-semibold">{user.fechaNacimiento}</span>
          </div>
          <div className="flex items-center justify-between bg-white/10 rounded-lg px-4 py-3">
            <span className="text-white/70 font-medium">Género:</span>
            <span className="text-white font-semibold">{user.genero}</span>
          </div>
          <div className="flex items-center justify-between bg-white/10 rounded-lg px-4 py-3">
            <span className="text-white/70 font-medium">Altura:</span>
            <span className="text-white font-semibold">{user.altura}</span>
          </div>
          <div className="flex items-center justify-between bg-white/10 rounded-lg px-4 py-3">
            <span className="text-white/70 font-medium">Peso:</span>
            <span className="text-white font-semibold">{user.peso}</span>
          </div>
          <div className="flex items-center justify-between bg-white/10 rounded-lg px-4 py-3">
            <span className="text-white/70 font-medium">Rol:</span>
            <span className="text-white font-semibold">{user.rol}</span>
          </div>
          <div className="flex items-center justify-between bg-white/10 rounded-lg px-4 py-3">
            <span className="text-white/70 font-medium">Progreso:</span>
            <span className="text-white font-semibold">{user.progreso}</span>
          </div>
          <div className="flex items-center justify-between bg-white/10 rounded-lg px-4 py-3">
            <span className="text-white/70 font-medium">Fecha de registro:</span>
            <span className="text-white font-semibold">{user.fechaRegistro}</span>
          </div>
          <div className="flex items-center justify-between bg-white/10 rounded-lg px-4 py-3">
            <span className="text-white/70 font-medium">Plan:</span>
            <span className={`font-semibold ${user.plan === 'Premium' ? 'text-yellow-300' : 'text-white'}`}>{user.plan}</span>
          </div>
        </div>
        <button className="mt-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-2 px-8 rounded-full transition-all duration-300 shadow-lg hover:scale-105">
          Editar Perfil
        </button>
      </section>
    </main>
  )
}

export default Perfil