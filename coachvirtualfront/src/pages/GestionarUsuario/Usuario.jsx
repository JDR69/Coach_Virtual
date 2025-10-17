import React, { Component } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // <- sin phosphor-react
import {
  listUsers,
  createUser,
  updateUser,
  deleteUser,
} from "../../services/UsuarioService";
import Paginacion from "../../components/Paginacion";

class Usuario extends Component {
  state = {
    form: {
      id: null,
      email: "",
      username: "",
      password: "",
      first_name: "",
      last_name: "",
      fecha_nacimiento: "",
      genero: "",
      altura: "",
      peso: "",
      is_active: true,
    },
    items: [],
    loadingList: false,
    loadingSave: false,
    errorList: null,
    errorSave: null,
    successSave: null,
    errorsByField: {},
    isEditing: false,

    // Paginación
    currentPage: 1,
    pageSize: 5,

    // Mostrar/ocultar contraseña
    showPassword: false,
  };

  componentDidMount() {
    this.loadList();
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevState.items.length !== this.state.items.length ||
      prevState.pageSize !== this.state.pageSize
    ) {
      this.ensurePageInRange();
    }
  }

  // ====== Paginación ======
  ensurePageInRange = () => {
    this.setState((prev) => {
      const totalPages = Math.max(1, Math.ceil(prev.items.length / prev.pageSize));
      const newPage = Math.min(prev.currentPage, totalPages) || 1;
      return newPage !== prev.currentPage ? { currentPage: newPage } : null;
    });
  };

  goToPage = (p) => this.setState({ currentPage: p });

  getPagedItems = () => {
    const { items, currentPage, pageSize } = this.state;
    const start = (currentPage - 1) * pageSize;
    return items.slice(start, start + pageSize);
  };

  // ====== API ======
  loadList = async () => {
    this.setState({ loadingList: true, errorList: null });
    try {
      const resp = await listUsers();
      this.setState({ items: resp.results, loadingList: false }, this.ensurePageInRange);
    } catch (err) {
      const msg =
        err?.response?.data?.detail ||
        err?.message ||
        "No se pudo cargar la lista de usuarios.";
      this.setState({ loadingList: false, errorList: msg });
    }
  };

  // ====== Form ======
  handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const v = type === "checkbox" ? checked : value;
    this.setState((prev) => ({
      form: { ...prev.form, [name]: v },
      errorSave: null,
      successSave: null,
      errorsByField: { ...prev.errorsByField, [name]: undefined },
    }));
  };

  togglePassword = () => {
    this.setState((prev) => ({ showPassword: !prev.showPassword }));
  };

  resetForm = () => {
    this.setState({
      form: {
        id: null,
        email: "",
        username: "",
        password: "",
        first_name: "",
        last_name: "",
        fecha_nacimiento: "",
        genero: "",
        altura: "",
        peso: "",
        is_active: true,
      },
      isEditing: false,
      errorSave: null,
      successSave: null,
      errorsByField: {},
      showPassword: false,
    });
  };

  editRow = (row) => {
    this.setState({
      form: {
        id: row.id,
        email: row.email || "",
        username: row.username || "",
        password: "",
        first_name: row.first_name || "",
        last_name: row.last_name || "",
        fecha_nacimiento: row.fecha_nacimiento || "",
        genero: row.genero || "",
        altura: row.altura ?? "",
        peso: row.peso ?? "",
        is_active: row.is_active ?? true,
      },
      isEditing: true,
      errorSave: null,
      successSave: null,
      errorsByField: {},
      showPassword: false,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  removeRow = async (row) => {
    if (!window.confirm(`¿Eliminar al usuario "${row.username}"?`)) return;
    try {
      await deleteUser(row.id);
      this.setState(
        (prev) => ({ items: prev.items.filter((x) => x.id !== row.id) }),
        this.ensurePageInRange
      );
      if (this.state.form.id === row.id) this.resetForm();
    } catch (err) {
      const msg =
        err?.response?.data?.detail || err?.message || "No se pudo eliminar.";
      alert(msg);
    }
  };

  validate = () => {
    const { email, username, password } = this.state.form;
    const errors = {};
    if (!email?.trim()) errors.email = "Email requerido";
    if (!username?.trim()) errors.username = "Usuario requerido";
    if (!this.state.isEditing && !password?.trim())
      errors.password = "Contraseña requerida";
    this.setState({ errorsByField: errors });
    return Object.keys(errors).length === 0;
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    if (this.state.loadingSave) return;
    if (!this.validate()) return;

    this.setState({ loadingSave: true, errorSave: null, successSave: null });

    const {
      id,
      email,
      username,
      password,
      first_name,
      last_name,
      fecha_nacimiento,
      genero,
      altura,
      peso,
      is_active,
    } = this.state.form;

    const payload = {
      email: email.trim(),
      username: username.trim(),
      first_name: first_name?.trim() || "",
      last_name: last_name?.trim() || "",
      fecha_nacimiento: fecha_nacimiento || null,
      genero: genero || "",
      altura: typeof altura === "string" ? altura.trim() : altura,
      peso: typeof peso === "string" ? peso.trim() : peso,
      is_active: !!is_active,
    };

    if (!this.state.isEditing || (password && password.trim())) {
      payload.password = password.trim();
    }

    try {
      let saved;
      if (this.state.isEditing && id) {
        saved = await updateUser(id, payload, { sanitize: false });
        this.setState({
          successSave: "Usuario actualizado correctamente.",
          loadingSave: false,
        });
        this.setState((prev) => ({
          items: prev.items.map((x) => (x.id === saved.id ? saved : x)),
        }));
      } else {
        saved = await createUser(payload);
        this.setState({
          successSave: "Usuario creado correctamente.",
          loadingSave: false,
        });
        this.setState((prev) => ({ items: [saved, ...prev.items] }));
      }
      this.resetForm();
      this.ensurePageInRange();
    } catch (err) {
      let msg = "Error al guardar.";
      let fieldErrors = {};
      if (err.response) {
        if (typeof err.response.data === "object") fieldErrors = err.response.data;
        msg = err.response.data?.detail || msg;
      } else if (err.message) {
        msg = err.message;
      }
      this.setState({
        loadingSave: false,
        errorSave: msg,
        errorsByField: fieldErrors,
      });
    }
  };

  // ====== UI helpers ======
  renderField(label, name, type = "text", props = {}) {
    const { form, errorsByField, showPassword, isEditing } = this.state;
    const hasError = Boolean(errorsByField?.[name]);

    // Campo especial: contraseña con ojito
    if (name === "password") {
      return (
        <div className="flex flex-col gap-1 relative">
          <label className="text-white/80 text-sm" htmlFor={name}>
            {isEditing ? "Contraseña (opcional)" : "Contraseña"}
          </label>
          <input
            id={name}
            name={name}
            type={showPassword ? "text" : "password"}
            value={form[name]}
            onChange={this.handleChange}
            className={`px-4 py-3 rounded-xl bg-white/10 border ${
              hasError ? "border-red-400" : "border-white/20"
            } text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/40 pr-10`}
            placeholder={isEditing ? "•••••••• (deja vacío para no cambiar)" : "••••••••"}
            {...props}
          />
          <button
            type="button"
            onClick={this.togglePassword}
            className="absolute right-3 top-9 text-white/70 hover:text-white focus:outline-none"
            aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
            title={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
          {hasError && (
            <span className="text-red-300 text-xs">
              {Array.isArray(errorsByField[name])
                ? errorsByField[name].join(", ")
                : String(errorsByField[name])}
            </span>
          )}
        </div>
      );
    }

    // Campo genérico
    return (
      <div className="flex flex-col gap-1">
        <label className="text-white/80 text-sm" htmlFor={name}>
          {label}
        </label>
        <input
          id={name}
          name={name}
          type={type}
          value={form[name]}
          onChange={this.handleChange}
          className={`px-4 py-3 rounded-xl bg-white/10 border ${
            hasError ? "border-red-400" : "border-white/20"
          } text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/40`}
          {...props}
        />
        {hasError && (
          <span className="text-red-300 text-xs">
            {Array.isArray(errorsByField[name])
              ? errorsByField[name].join(", ")
              : String(errorsByField[name])}
          </span>
        )}
      </div>
    );
  }

  render() {
    const {
      items,
      loadingList,
      errorList,
      loadingSave,
      errorSave,
      successSave,
      isEditing,
      form,
      currentPage,
      pageSize,
    } = this.state;

    const total = items.length;
    const paged = this.getPagedItems();

    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 p-6">
        {/* Form */}
        <section className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-6 w-full max-w-3xl mx-auto border border-white/20 mb-8">
          <h1 className="text-2xl font-bold text-white text-center mb-4">
            {isEditing ? "Editar usuario" : "Crear usuario"}
          </h1>

          {errorSave && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/20 border border-red-400 text-red-100 text-sm">
              {errorSave}
            </div>
          )}
          {successSave && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-500/20 border border-emerald-400 text-emerald-100 text-sm">
              {successSave}
            </div>
          )}

          <form className="grid grid-cols-1 gap-4" onSubmit={this.handleSubmit}>
            {this.renderField("Email", "email", "email", {
              placeholder: "tucorreo@ejemplo.com",
            })}
            {this.renderField("Usuario", "username", "text", {
              placeholder: "usuario",
            })}
            {this.renderField("Contraseña", "password", "password")}

            {/* Nombres */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {this.renderField("Nombre", "first_name")}
              {this.renderField("Apellido", "last_name")}
            </div>

            {/* Otros datos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {this.renderField("Fecha de nacimiento", "fecha_nacimiento", "date")}
              {this.renderField("Género", "genero", "text", { placeholder: "Masculino/Femenino/Otro" })}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {this.renderField("Altura (m)", "altura", "text", { placeholder: "1.75" })}
              {this.renderField("Peso (kg)", "peso", "text", { placeholder: "70" })}
            </div>

            {/* Checkbox activo */}
            <div className="flex items-center gap-2">
              <input
                id="is_active"
                name="is_active"
                type="checkbox"
                checked={!!form.is_active}
                onChange={this.handleChange}
                className="h-5 w-5"
              />
              <label htmlFor="is_active" className="text-white/80 text-sm">
                Activo
              </label>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={loadingSave}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 text-white font-bold py-3 px-6 rounded-2xl transition-all shadow-lg hover:scale-[1.02]"
              >
                {loadingSave ? "Guardando…" : isEditing ? "Guardar cambios" : "Crear"}
              </button>
              {isEditing && (
                <button
                  type="button"
                  onClick={this.resetForm}
                  className="bg-white/10 border border-white/30 text-white py-3 px-6 rounded-2xl hover:bg-white/20"
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </section>

        {/* Listado */}
        <section className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-6 w-full max-w-5xl mx-auto border border-white/20">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">Listado de usuarios</h2>
            <button
              onClick={this.loadList}
              className="text-white/80 text-sm underline hover:text-white"
            >
              Recargar
            </button>
          </div>

          {loadingList ? (
            <p className="text-white/80">Cargando…</p>
          ) : errorList ? (
            <div className="p-3 rounded-xl bg-yellow-500/20 border border-yellow-400 text-yellow-100 text-sm">
              {errorList}
            </div>
          ) : total === 0 ? (
            <p className="text-white/80">No hay usuarios.</p>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm text-white/90">
                  <thead>
                    <tr className="text-left border-b border-white/20">
                      <th className="py-2 pr-4">ID</th>
                      <th className="py-2 pr-4">Usuario</th>
                      <th className="py-2 pr-4">Email</th>
                      <th className="py-2 pr-4">Nombre</th>
                      <th className="py-2 pr-4">Género</th>
                      <th className="py-2 pr-4">Altura</th>
                      <th className="py-2 pr-4">Peso</th>
                      <th className="py-2 pr-4">Activo</th>
                      <th className="py-2 pr-4">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paged.map((row) => (
                      <tr key={row.id} className="border-b border-white/10">
                        <td className="py-2 pr-4">{row.id}</td>
                        <td className="py-2 pr-4">{row.username}</td>
                        <td className="py-2 pr-4">{row.email}</td>
                        <td className="py-2 pr-4">
                          {(row.first_name || "") + " " + (row.last_name || "")}
                        </td>
                        <td className="py-2 pr-4">{row.genero || "-"}</td>
                        <td className="py-2 pr-4">{row.altura ?? "-"}</td>
                        <td className="py-2 pr-4">{row.peso ?? "-"}</td>
                        <td className="py-2 pr-4">
                          <span
                            className={`px-2 py-1 rounded text-xs ${
                              row.is_active ? "bg-emerald-600/60" : "bg-rose-600/60"
                            }`}
                          >
                            {row.is_active ? "Sí" : "No"}
                          </span>
                        </td>
                        <td className="py-2 pr-4">
                          <div className="flex gap-2">
                            <button
                              className="px-3 py-1 rounded bg-blue-600 hover:bg-blue-700"
                              onClick={() => this.editRow(row)}
                            >
                              Editar
                            </button>
                            <button
                              className="px-3 py-1 rounded bg-rose-600 hover:bg-rose-700"
                              onClick={() => this.removeRow(row)}
                            >
                              Eliminar
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <Paginacion
                page={currentPage}
                total={total}
                pageSize={pageSize}
                onChange={this.goToPage}
              />
            </>
          )}
        </section>
      </main>
    );
  }
}

export default Usuario;
