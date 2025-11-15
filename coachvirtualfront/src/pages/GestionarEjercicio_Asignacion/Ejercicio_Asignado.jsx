// src/pages/ejercicio-asignado/Ejercicio_Asignado.jsx
import React, { Component } from "react";
import EjercicioAsignadoService from "../../services/Ejercicio_AsignadoService.js";
import DetalleMusculoService from "../../services/DetalleMusculoService.js";
import MusculoService from "../../services/MusculoService.js";
import EjercicioService from "../../services/EjercicioService.js";
import Paginacion from "../../components/Paginacion";

class Ejercicio_Asignado extends Component {
  state = {
    form: { idDetalleMusculo: "", series: "", repeticiones: "" },

    items: [], // ejercicios asignados
    detalles: [],
    musculos: [],
    ejercicios: [],

    loadingList: false,
    loadingSave: false,
    errorList: null,
    errorSave: null,
    successSave: null,
    errorsByField: {},
    isEditing: false,
    editingId: null,

    currentPage: 1,
    pageSize: 5,
  };

  componentDidMount() {
    this.fetchAll();
  }

  // =============== CARGA INICIAL =================
  fetchAll = async () => {
    this.setState({ loadingList: true, errorList: null });
    try {
      const [asignados, detalles, musculos, ejercicios] = await Promise.all([
        EjercicioAsignadoService.getAll(),
        DetalleMusculoService.getAll(),
        MusculoService.getAll(),
        EjercicioService.getAll(),
      ]);

      this.setState({
        items: Array.isArray(asignados) ? asignados : [],
        detalles: Array.isArray(detalles) ? detalles : [],
        musculos: Array.isArray(musculos) ? musculos : [],
        ejercicios: Array.isArray(ejercicios) ? ejercicios : [],
        loadingList: false,
      });
    } catch (err) {
      console.error(err);
      this.setState({
        errorList: err.message || "Error al cargar los datos",
        loadingList: false,
      });
    }
  };

  // =============== HELPERS =================
  getPagedItems() {
    const { items, currentPage, pageSize } = this.state;
    const start = (currentPage - 1) * pageSize;
    return items.slice(start, start + pageSize);
  }

  findDetalle = (id) => {
    const { detalles } = this.state;
    const numId = Number(id);
    return detalles.find((d) => Number(d.id) === numId);
  };

  findMusculo = (id) => {
    const { musculos } = this.state;
    const numId = Number(id);
    return musculos.find((m) => Number(m.id) === numId);
  };

  findEjercicio = (id) => {
    const { ejercicios } = this.state;
    const numId = Number(id);
    return ejercicios.find((e) => Number(e.id) === numId);
  };

  // =============== FORM =================
  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState((prev) => ({
      form: { ...prev.form, [name]: value },
      errorsByField: { ...prev.errorsByField, [name]: undefined },
      errorSave: null,
      successSave: null,
    }));
  };

  validate = () => {
    const { idDetalleMusculo, series, repeticiones } = this.state.form;
    const errors = {};

    if (!idDetalleMusculo?.trim())
      errors.idDetalleMusculo = "El detalle es obligatorio";

    if (!series?.toString().trim()) {
      errors.series = "Las series son obligatorias";
    } else if (Number(series) <= 0) {
      errors.series = "Debe ser mayor que 0";
    }

    if (!repeticiones?.toString().trim()) {
      errors.repeticiones = "Las repeticiones son obligatorias";
    } else if (Number(repeticiones) <= 0) {
      errors.repeticiones = "Debe ser mayor que 0";
    }

    this.setState({ errorsByField: errors });
    return Object.keys(errors).length === 0;
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    if (!this.validate()) return;

    this.setState({ loadingSave: true, errorSave: null, successSave: null });

    const payload = {
      idDetalleMusculo: Number(this.state.form.idDetalleMusculo),
      series: Number(this.state.form.series),
      repeticiones: Number(this.state.form.repeticiones),
    };

    try {
      let savedItem;
      if (this.state.isEditing) {
        savedItem = await EjercicioAsignadoService.update(
          this.state.editingId,
          payload
        );
        this.setState((prev) => ({
          items: prev.items.map((it) =>
            it.id === savedItem.id ? savedItem : it
          ),
          successSave: "Ejercicio asignado actualizado exitosamente",
          loadingSave: false,
        }));
      } else {
        savedItem = await EjercicioAsignadoService.create(payload);
        this.setState((prev) => ({
          items: [...prev.items, savedItem],
          successSave: "Ejercicio asignado creado exitosamente",
          loadingSave: false,
        }));
      }
      this.resetForm();
    } catch (err) {
      this.setState({
        errorSave: err.message || "Error al guardar",
        loadingSave: false,
      });
    }
  };

  resetForm = () => {
    this.setState({
      form: { idDetalleMusculo: "", series: "", repeticiones: "" },
      isEditing: false,
      editingId: null,
      errorSave: null,
      successSave: null,
      errorsByField: {},
    });
  };

  editRow = (item) => {
    this.setState({
      form: {
        idDetalleMusculo: String(item.idDetalleMusculo),
        series: String(item.series),
        repeticiones: String(item.repeticiones),
      },
      isEditing: true,
      editingId: item.id,
      errorSave: null,
      successSave: null,
      errorsByField: {},
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  removeRow = async (item) => {
    if (
      !window.confirm(
        `¿Eliminar el ejercicio asignado (#${item.id})? Esta acción no se puede deshacer.`
      )
    )
      return;

    try {
      await EjercicioAsignadoService.delete(item.id);
      this.setState((prev) => ({
        items: prev.items.filter((x) => x.id !== item.id),
        successSave: "Ejercicio asignado eliminado exitosamente",
      }));
    } catch (err) {
      this.setState({ errorSave: err.message || "Error al eliminar" });
    }
  };

  // =============== UI HELPERS =================
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
          value={form[name] || ""}
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

  renderSelectDetalle() {
    const { form, errorsByField, detalles } = this.state;
    const hasError = Boolean(errorsByField?.idDetalleMusculo);

    const safeDetalles = Array.isArray(detalles) ? detalles : [];

    return (
      <div className="flex flex-col gap-1">
        <label className="text-white/80 text-sm" htmlFor="idDetalleMusculo">
          Detalle de músculo
        </label>
        <select
          id="idDetalleMusculo"
          name="idDetalleMusculo"
          value={form.idDetalleMusculo || ""}
          onChange={this.handleChange}
          className={`px-4 py-3 rounded-xl bg-white/10 border ${
            hasError ? "border-red-400" : "border-white/20"
          } text-white focus:outline-none focus:ring-2 focus:ring-white/40`}
        >
          <option value="" className="text-slate-900">
            Seleccione una opción
          </option>
          {safeDetalles.map((detalle) => {
            const musculo = this.findMusculo(detalle.idMusculo);
            const ejercicio = this.findEjercicio(detalle.idEjercicio);
            const labelParts = [];
            if (musculo) labelParts.push(`Músculo: ${musculo.nombre}`);
            if (ejercicio) labelParts.push(`Ejercicio: ${ejercicio.nombre}`);
            if (detalle.porcentaje)
              labelParts.push(`Activación: ${detalle.porcentaje}`);
            const label = labelParts.join(" · ") || `Detalle #${detalle.id}`;

            return (
              <option
                key={detalle.id}
                value={detalle.id}
                className="text-slate-900"
              >
                {label}
              </option>
            );
          })}
        </select>
        {hasError && (
          <span className="text-red-300 text-xs">
            {Array.isArray(errorsByField.idDetalleMusculo)
              ? errorsByField.idDetalleMusculo.join(", ")
              : String(errorsByField.idDetalleMusculo)}
          </span>
        )}
      </div>
    );
  }

  // =============== RENDER =================
  render() {
    const {
      successSave,
      errorSave,
      loadingSave,
      isEditing,
      items,
      currentPage,
      pageSize,
      form,
      loadingList,
    } = this.state;

    const pagedItems = Array.isArray(this.getPagedItems())
      ? this.getPagedItems()
      : [];

    const selectedDetalle = form.idDetalleMusculo
      ? this.findDetalle(form.idDetalleMusculo)
      : null;
    const selectedMusculo = selectedDetalle
      ? this.findMusculo(selectedDetalle.idMusculo)
      : null;
    const selectedEjercicio = selectedDetalle
      ? this.findEjercicio(selectedDetalle.idEjercicio)
      : null;

    return (
      <main className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 p-4">
        <section className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-8 md:p-12 max-w-6xl w-full border border-white/20 text-white">
          <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 mb-6 text-center">
            Gestionar Ejercicios Asignados
          </h1>

          {/* Mensajes */}
          {successSave && (
            <div className="mb-4 p-4 bg-green-500/20 border border-green-500/50 rounded-xl text-green-200">
              {successSave}
            </div>
          )}
          {errorSave && (
            <div className="mb-4 p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200">
              Error: {errorSave}
            </div>
          )}

          {/* FORMULARIO */}
          <form onSubmit={this.handleSubmit} className="mb-8 space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              {this.renderSelectDetalle()}
              {this.renderField("Series", "series", "number", {
                placeholder: "Ej: 4",
                min: 1,
              })}
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {this.renderField("Repeticiones", "repeticiones", "number", {
                placeholder: "Ej: 12",
                min: 1,
              })}

              {/* PREVIEW RESUMEN DEL DETALLE SELECCIONADO */}
              <div className="bg-white/5 rounded-2xl p-4 border border-white/10 flex flex-col md:flex-row gap-3 items-center">
                {selectedMusculo?.url && (
                  <img
                    src={selectedMusculo.url}
                    alt={selectedMusculo.nombre}
                    className="w-20 h-20 object-cover rounded-xl border border-white/20"
                  />
                )}
                {selectedEjercicio?.url && (
                  <img
                    src={selectedEjercicio.url}
                    alt={selectedEjercicio.nombre}
                    className="w-20 h-20 object-cover rounded-xl border border-white/20"
                  />
                )}
                <div className="text-xs text-white/80 text-left">
                  <p className="font-semibold mb-1">
                    Resumen del detalle seleccionado
                  </p>
                  {selectedDetalle ? (
                    <>
                      <p>
                        <span className="font-semibold">Músculo:</span>{" "}
                        {selectedMusculo
                          ? selectedMusculo.nombre
                          : selectedDetalle.idMusculo}
                      </p>
                      <p>
                        <span className="font-semibold">Ejercicio:</span>{" "}
                        {selectedEjercicio
                          ? selectedEjercicio.nombre
                          : selectedDetalle.idEjercicio}
                      </p>
                      <p>
                        <span className="font-semibold">Activación:</span>{" "}
                        {selectedDetalle.porcentaje}
                      </p>
                    </>
                  ) : (
                    <p className="text-white/50">
                      Aún no has seleccionado un detalle de músculo.
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-3 justify-center mt-4">
              <button
                type="submit"
                disabled={loadingSave}
                className="px-6 py-3 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold shadow-lg hover:scale-105 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loadingSave
                  ? "Guardando..."
                  : isEditing
                  ? "Actualizar"
                  : "Crear"}
              </button>
              {isEditing && (
                <button
                  type="button"
                  onClick={this.resetForm}
                  className="px-6 py-3 rounded-full border-2 border-white/30 hover:border-white/60 text-white font-semibold transition hover:bg-white/10"
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>

          {/* LISTA */}
          {loadingList ? (
            <div className="text-center py-8">
              <p className="text-white/60">Cargando ejercicios asignados...</p>
            </div>
          ) : (
            <>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 text-left">
                {pagedItems.map((item) => {
                  const detalle = this.findDetalle(item.idDetalleMusculo);
                  const musculo = detalle
                    ? this.findMusculo(detalle.idMusculo)
                    : null;
                  const ejercicio = detalle
                    ? this.findEjercicio(detalle.idEjercicio)
                    : null;

                  return (
                    <div
                      key={item.id}
                      className="rounded-2xl p-6 bg-white/10 hover:bg-white/20 border border-white/20 transition-all shadow-lg"
                    >
                      <p className="text-xs text-white/60 mb-2">
                        Ejercicio asignado #{item.id}
                      </p>

                      <div className="flex gap-3 mb-4">
                        <div className="flex-1">
                          {musculo?.url && (
                            <img
                              src={musculo.url}
                              alt={musculo.nombre}
                              className="w-full h-24 object-cover rounded-xl border border-white/20 mb-1"
                            />
                          )}
                          <p className="text-xs text-white/70">
                            <span className="font-semibold">Músculo:</span>{" "}
                            {musculo ? musculo.nombre : detalle?.idMusculo}
                          </p>
                        </div>
                        <div className="flex-1">
                          {ejercicio?.url && (
                            <img
                              src={ejercicio.url}
                              alt={ejercicio.nombre}
                              className="w-full h-24 object-cover rounded-xl border border-white/20 mb-1"
                            />
                          )}
                          <p className="text-xs text-white/70">
                            <span className="font-semibold">Ejercicio:</span>{" "}
                            {ejercicio ? ejercicio.nombre : detalle?.idEjercicio}
                          </p>
                        </div>
                      </div>

                      {detalle && (
                        <p className="text-xs text-white/70 mb-2">
                          <span className="font-semibold">Activación:</span>{" "}
                          {detalle.porcentaje}
                        </p>
                      )}

                      <p className="text-sm text-white/80 mb-4">
                        <span className="font-semibold">Series x reps:</span>{" "}
                        {item.series} x {item.repeticiones}
                      </p>

                      <div className="flex gap-2">
                        <button
                          onClick={() => this.editRow(item)}
                          className="flex-1 px-4 py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold transition"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => this.removeRow(item)}
                          className="flex-1 px-4 py-2 rounded-full bg-red-600 hover:bg-red-700 text-white font-semibold transition"
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {pagedItems.length === 0 && (
                <p className="text-center text-white/60 mt-8">
                  No hay ejercicios asignados todavía.
                </p>
              )}

              <Paginacion
                page={currentPage}
                total={items.length}
                pageSize={pageSize}
                onChange={(page) => this.setState({ currentPage: page })}
              />
            </>
          )}

          <footer className="mt-8 text-white/40 text-xs text-center">
            Coach Virtual &copy; {new Date().getFullYear()}
          </footer>
        </section>
      </main>
    );
  }
}

export default Ejercicio_Asignado;
