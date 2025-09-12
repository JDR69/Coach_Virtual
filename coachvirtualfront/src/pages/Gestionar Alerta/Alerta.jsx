// src/components/alertas/AlertasCrud.jsx
import React, { Component } from "react";
import api from "../../api/api"; // axios instance con baseURL + token si lo usas

class Alerta extends Component {
  state = {
    form: {
      id: null,
      mensaje: "",
      fecha: "",
      estado: true,
    },
    items: [],
    loadingList: false,
    loadingSave: false,
    errorList: null,
    errorSave: null,
    successSave: null,
    errorsByField: {},
    isEditing: false,
  };

  componentDidMount() {
    this.loadList();
  }

  // ====== API ======
  loadList = async () => {
    this.setState({ loadingList: true, errorList: null });
    try {
      const { data } = await api.get("/alertas/"); // superuser required
      this.setState({ items: data, loadingList: false });
    } catch (err) {
      const msg =
        err?.response?.data?.detail ||
        err?.message ||
        "No se pudo cargar la lista de alertas.";
      this.setState({ loadingList: false, errorList: msg });
    }
  };

  createItem = async (payload) => {
    const { data } = await api.post("/alertas/", payload);
    return data;
  };

  updateItem = async (id, payload) => {
    const { data } = await api.put(`/alertas/${id}/`, payload);
    return data;
  };

  deleteItem = async (id) => {
    await api.delete(`/alertas/${id}/`);
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

  resetForm = () => {
    this.setState({
      form: { id: null, mensaje: "", fecha: "", estado: true },
      isEditing: false,
      errorSave: null,
      successSave: null,
      errorsByField: {},
    });
  };

  editRow = (row) => {
    this.setState({
      form: { id: row.id, mensaje: row.mensaje, fecha: row.fecha, estado: row.estado },
      isEditing: true,
      errorSave: null,
      successSave: null,
      errorsByField: {},
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  removeRow = async (row) => {
    if (!window.confirm(`¿Eliminar la alerta "${row.mensaje}"?`)) return;
    try {
      await this.deleteItem(row.id);
      this.setState((prev) => ({
        items: prev.items.filter((x) => x.id !== row.id),
      }));
      if (this.state.form.id === row.id) this.resetForm();
    } catch (err) {
      const msg =
        err?.response?.data?.detail || err?.message || "No se pudo eliminar.";
      alert(msg);
    }
  };

  validate = () => {
    const { mensaje, fecha } = this.state.form;
    const errors = {};
    if (!mensaje?.trim()) errors.mensaje = "Mensaje requerido";
    if (!fecha) errors.fecha = "Fecha requerida (YYYY-MM-DD)";
    this.setState({ errorsByField: errors });
    return Object.keys(errors).length === 0;
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    if (this.state.loadingSave) return;
    if (!this.validate()) return;

    this.setState({ loadingSave: true, errorSave: null, successSave: null });

    const payload = {
      mensaje: this.state.form.mensaje.trim(),
      fecha: this.state.form.fecha, // YYYY-MM-DD
      estado: !!this.state.form.estado, // opcional; default True en backend
    };

    try {
      let saved;
      if (this.state.isEditing && this.state.form.id) {
        saved = await this.updateItem(this.state.form.id, payload);
        this.setState({
          successSave: "Alerta actualizada correctamente.",
          loadingSave: false,
        });
        // actualizar fila en memoria
        this.setState((prev) => ({
          items: prev.items.map((x) => (x.id === saved.id ? saved : x)),
        }));
      } else {
        saved = await this.createItem(payload);
        this.setState({
          successSave: "Alerta creada correctamente.",
          loadingSave: false,
        });
        // agregar arriba
        this.setState((prev) => ({ items: [saved, ...prev.items] }));
      }
      this.resetForm();
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
    const { form, errorsByField } = this.state;
    const hasError = Boolean(errorsByField?.[name]);
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
    } = this.state;

    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 p-6">
        {/* Form */}
        <section className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-6 w-full max-w-3xl mx-auto border border-white/20 mb-8">
          <h1 className="text-2xl font-bold text-white text-center mb-4">
            {isEditing ? "Editar alerta" : "Crear alerta"}
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
            {this.renderField("Mensaje", "mensaje", "text", {
              placeholder: "Recordatorio…",
            })}
            {this.renderField("Fecha", "fecha", "date")}
            {/* Checkbox estado */}
            <div className="flex items-center gap-2">
              <input
                id="estado"
                name="estado"
                type="checkbox"
                checked={!!form.estado}
                onChange={this.handleChange}
                className="h-5 w-5"
              />
              <label htmlFor="estado" className="text-white/80 text-sm">
                Activa
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
            <h2 className="text-xl font-semibold text-white">Listado de alertas</h2>
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
          ) : items.length === 0 ? (
            <p className="text-white/80">No hay alertas.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-white/90">
                <thead>
                  <tr className="text-left border-b border-white/20">
                    <th className="py-2 pr-4">ID</th>
                    <th className="py-2 pr-4">Mensaje</th>
                    <th className="py-2 pr-4">Fecha</th>
                    <th className="py-2 pr-4">Estado</th>
                    <th className="py-2 pr-4">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((row) => (
                    <tr key={row.id} className="border-b border-white/10">
                      <td className="py-2 pr-4">{row.id}</td>
                      <td className="py-2 pr-4">{row.mensaje}</td>
                      <td className="py-2 pr-4">{row.fecha}</td>
                      <td className="py-2 pr-4">
                        <span
                          className={`px-2 py-1 rounded text-xs ${
                            row.estado ? "bg-emerald-600/60" : "bg-rose-600/60"
                          }`}
                        >
                          {row.estado ? "Activa" : "Inactiva"}
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
          )}
        </section>
      </main>
    );
  }
}

export default Alerta;
