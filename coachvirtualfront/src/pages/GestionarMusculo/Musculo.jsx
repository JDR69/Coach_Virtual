import React, { Component } from 'react';
import MusculoService from '../../services/MusculoService';

class Musculo extends Component {
  state = {
    form: { nombre: '', url: '' },
    items: [],
    loadingList: false,
    loadingSave: false,
    errorList: null,
    errorSave: null,
    successSave: null,
    errorsByField: {},
    isEditing: false,
    editingId: null,

    // ===== Paginación =====
    currentPage: 1, // 1-based
    pageSize: 5,    // 5 en 5
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

  ensurePageInRange = () => {
    this.setState((prev) => {
      const totalPages = Math.ceil(prev.items.length / prev.pageSize);
      return {
        currentPage: Math.min(prev.currentPage, totalPages),
      };
    });
  };

  goToPage = (p) => {
    this.setState({ currentPage: p });
  };

  getPagedItems = () => {
    const { items, currentPage, pageSize } = this.state;
    const start = (currentPage - 1) * pageSize;
    return items.slice(start, start + pageSize);
  };

  loadList = async () => {
    this.setState({ loadingList: true, errorList: null });
    try {
      const items = await MusculoService.getAll();
      this.setState({ items, loadingList: false });
    } catch (err) {
      this.setState({ errorList: err.message, loadingList: false });
    }
  };

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState((prev) => ({
      form: { ...prev.form, [name]: value },
      errorSave: null,
      successSave: null,
      errorsByField: { ...prev.errorsByField, [name]: undefined },
    }));
  };

  resetForm = () => {
    this.setState({
      form: { nombre: '', url: '' },
      isEditing: false,
      editingId: null,
      errorSave: null,
      successSave: null,
      errorsByField: {},
    });
  };

  editRow = (row) => {
    this.setState({
      form: { nombre: row.nombre, url: row.url },
      isEditing: true,
      editingId: row.id,
      errorSave: null,
      successSave: null,
      errorsByField: {},
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  removeRow = async (row) => {
    if (!window.confirm(`¿Eliminar el músculo "${row.nombre}"?`)) return;
    try {
      await MusculoService.delete(row.id);
      this.setState((prev) => ({
        items: prev.items.filter((item) => item.id !== row.id),
      }));
    } catch (err) {
      console.error(err);
    }
  };

  validate = () => {
    const { nombre, url } = this.state.form;
    const errors = {};
    if (!nombre?.trim()) errors.nombre = 'El nombre es obligatorio';
    if (!url?.trim()) errors.url = 'La URL es obligatoria';
    this.setState({ errorsByField: errors });
    return Object.keys(errors).length === 0;
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    if (this.state.loadingSave) {
      return;
    }
    if (!this.validate()) {
      return;
    }

    this.setState({ loadingSave: true, errorSave: null, successSave: null });

    const payload = {
      nombre: this.state.form.nombre.trim(),
      url: this.state.form.url.trim(),
    };

    try {
      let savedItem;
      if (this.state.isEditing) {
        savedItem = await MusculoService.update(this.state.editingId, payload);
        this.setState((prev) => ({
          items: prev.items.map((item) =>
            item.id === savedItem.id ? savedItem : item
          ),
          successSave: 'Músculo actualizado exitosamente',
          loadingSave: false,
        }));
      } else {
        savedItem = await MusculoService.create(payload);
        this.setState((prev) => ({
          items: [...prev.items, savedItem],
          successSave: 'Músculo creado exitosamente',
          loadingSave: false,
        }));
      }
      this.resetForm();
    } catch (err) {
      this.setState({ errorSave: err.message, loadingSave: false });
    }
  };

  // Añadir método para subir imágenes a Cloudinary
  uploadImage = async (e) => {
    const preset_name = "coachVirtual";
    const cloud_name = "dwerzrgya";

    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const data = new FormData();
    data.append('file', files[0]);
    data.append('upload_preset', preset_name);

    this.setState({ loadingSave: true, errorSave: null });

    try {
        const response = await fetch(`https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`, {
            method: 'POST',
            body: data,
        });

        const file = await response.json();
        this.setState((prev) => ({
            form: { ...prev.form, url: file.secure_url },
            successSave: 'Imagen cargada exitosamente',
            loadingSave: false,
        }));
    } catch {
        this.setState({ 
          errorSave: 'Error al cargar la imagen',
          loadingSave: false 
        });
    }
};

  renderField(label, name, type = 'text', props = {}) {
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
          value={form[name] || ''}
          onChange={this.handleChange}
          className={`px-4 py-3 rounded-xl bg-white/10 border ${
            hasError ? 'border-red-400' : 'border-white/20'
          } text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/40`}
          {...props}
        />
        {hasError && (
          <span className="text-red-300 text-xs">
            {Array.isArray(errorsByField[name])
              ? errorsByField[name].join(', ')
              : String(errorsByField[name])}
          </span>
        )}
      </div>
    );
  }

  render() {
    const { successSave, errorSave, form, loadingSave, isEditing, loadingList } = this.state;
    const pagedItems = Array.isArray(this.getPagedItems()) ? this.getPagedItems() : [];

    return (
      <main className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 p-4">
        <section className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-8 md:p-12 max-w-6xl w-full border border-white/20 text-white">
          <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 mb-6 text-center">
            Gestionar Músculos
          </h1>

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

          <form onSubmit={this.handleSubmit} className="mb-8 space-y-4">
            <div className="flex flex-col gap-4">
              {this.renderField('Nombre', 'nombre', 'text', { placeholder: 'Nombre del músculo' })}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-white/80 text-sm" htmlFor="image">
                Subir Imagen
              </label>
              <input
                id="image"
                type="file"
                onChange={this.uploadImage}
                accept="image/*"
                className="px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
              />
            </div>

            {form.url && (
              <div className="flex justify-center">
                <img
                  src={form.url}
                  alt="Vista previa"
                  className="max-w-xs h-auto rounded-xl border border-white/20"
                />
              </div>
            )}

            <div className="flex gap-3 justify-center">
              <button
                type="submit"
                disabled={loadingSave}
                className="px-6 py-3 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold shadow-lg hover:scale-105 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loadingSave ? 'Guardando...' : (isEditing ? 'Actualizar' : 'Crear')}
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

          {loadingList ? (
            <div className="text-center py-8">
              <p className="text-white/60">Cargando músculos...</p>
            </div>
          ) : (
            <>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 text-left">
                {pagedItems.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-2xl p-6 bg-white/10 hover:bg-white/20 border border-white/20 transition-all shadow-lg"
                  >
                    {item.url && (
                      <img
                        src={item.url}
                        alt={item.nombre}
                        className="w-full h-40 object-cover rounded-xl mb-4"
                      />
                    )}
                    <h3 className="text-xl font-semibold mb-2">{item.nombre}</h3>
                    <p className="text-sm text-white/70 mb-4">ID: {item.id}</p>

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
                ))}
              </div>

              {pagedItems.length === 0 && (
                <p className="text-center text-white/60 mt-8">
                  No hay músculos registrados todavía.
                </p>
              )}
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

export default Musculo;