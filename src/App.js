import React, { Component } from "react";
import "./App.css";
import axios from "axios";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrashAlt, faWindowClose } from "@fortawesome/free-solid-svg-icons";
import FileBase64 from 'react-file-base64';

const url = "http://localhost:7070/api/Producto/";

class App extends Component {

  state = {
    data: [],
    modalInsertar: false,
    modalEliminar: false,
    modalValida: false,
    form: {
      id: 0,
      nombre: "",
      descripción: "",
      precio: 0,
      imagen: "",
    }
  };

  consultaProductos = () => {
    axios
      .get(url)
      .then((response) => {
        this.setState({ data: response.data });
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  insertaProducto = async () => {
    
    this.setState({
      form: {
        ...this.state.form,
        id: 0,
      },
    });

    console.log(this.state.form);

    await axios
      .post(url, this.state.form)
      .then((response) => {
        this.modalInsertar();
        this.consultaProductos();
      })
      .catch((error) => {
        console.log(error.message);
        this.setState({ modalValida: true });
      });
  };

  actualizaProducto = () => {
    console.log(this.state.form);
    axios.put(url + this.state.form.id, this.state.form).then((response) => {
      this.modalInsertar();
      this.consultaProductos();
    }).catch((error) => {
      console.log(error.message);
      this.setState({ modalValida: true });
    });


  };

  eliminaProducto = () => {
    axios.delete(url + this.state.form.id).then((response) => {
      this.setState({ modalEliminar: false });
      this.consultaProductos();
    });
  };

  modalInsertar = () => {
    this.setState({ modalInsertar: !this.state.modalInsertar });
  };

  seleccionarProducto = (producto) => {
    this.setState({
      tipoModal: "actualizar",
      form: {
        id: producto.id,
        nombre: producto.nombre,
        descripción: producto.descripción,
        precio: producto.precio,
        imagen: producto.imagen,
      },
    });
  };

  handleChange = async (e) => {
    e.persist();
    await this.setState({
      form: {
        ...this.state.form,
        [e.target.name]: e.target.value,
      },
    });
    console.log(this.state.form);
  };

  componentDidMount() {
    this.consultaProductos();
  }

  getFiles(files){

    this.setState({
      form: {
        ...this.state.form,
        imagen: files.base64.replace('data:image/png;base64,',''),
      },
    });

    // console.log(files.base64.replace('data:image/png;base64,',''))
    // this.setState({ form{imagen}: files })
  }

  render() {
    const { form } = this.state;

    return (
      <div className="App">
        <br />
        <button
          className="btn btn-success"
          onClick={() => {
            this.setState({ form: null, tipoModal: "insertar" });
            this.modalInsertar();
          }}
        >
          Agregar Producto
        </button>
        <br />

        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Precio</th>
              <th>Imagen</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {this.state.data.map((producto) => {
              return (
                <tr>
                  <td>{producto.id}</td>
                  <td>{producto.nombre}</td>
                  <td>{producto.descripción}</td>
                  <td>{"$" + producto.precio}</td>
                  <td>
                    <img src={"data:image/png;base64," + producto.imagen} />
                  </td>
                  <td>
                    <button
                      className="btn btn-primary"
                      onClick={() => {
                        this.seleccionarProducto(producto);
                        this.modalInsertar();
                      }}
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </button>{" "}
                    <button
                      className="btn btn-danger"
                      onClick={() => {
                        this.seleccionarProducto(producto);
                        this.setState({ modalEliminar: true });
                      }}
                    >
                      <FontAwesomeIcon icon={faTrashAlt} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <Modal isOpen={this.state.modalInsertar}>
          <ModalHeader style={{ display: "block" }}>
            Producto
              <FontAwesomeIcon icon={faWindowClose} 
              style={{ float: "right", cursor:"pointer"  }}
              onClick={() => this.modalInsertar()}
              />

          </ModalHeader>
          <ModalBody>
            <div className="form-group">
              {/* <label htmlFor="id">ID</label>
              <input
                className="form-control"
                type="text"
                id="id"
                readOnly
                onChange={this.handleChange}
                value={form ? form.id : this.state.data.length + 1}
              />
              <br /> */}
              <label htmlFor="nombre">Nombre</label>
              <input
                className="form-control"
                type="text"
                name="nombre"
                id="nombre"
                onChange={this.handleChange}
                value={form ? form.nombre : ""}
              />
              <br />
              <label htmlFor="nombre">Descripción</label>
              <input
                className="form-control"
                type="text"
                name="descripción"
                id="descripción"
                onChange={this.handleChange}
                value={form ? form.descripción : ""}
              />
              <br />
              <label htmlFor="Precio">Precio</label>
              <input
                className="form-control"
                type="number"
                name="precio"
                id="precio"
                onChange={this.handleChange}
                value={form ? form.precio : ''}
              />
              <br />
              {/* <label htmlFor="Imagen">Imagen</label> */}
              <FileBase64
                className="form-control"
                // id="imagen"
                onDone={ this.getFiles.bind(this) }
                value=""
              />
            </div>
          </ModalBody>

          <ModalFooter>
            {this.state.tipoModal == "insertar" ? (
              <button
                className="btn btn-success"
                onClick={() => this.insertaProducto()}
              >
                Insertar
              </button>
            ) : (
              <button
                className="btn btn-primary"
                onClick={() => this.actualizaProducto()}
              >
                Actualizar
              </button>
            )}
            <button
              className="btn btn-danger"
              onClick={() => this.modalInsertar()}
            >
              Cancelar
            </button>
          </ModalFooter>
        </Modal>

        <Modal isOpen={this.state.modalEliminar}>
          <ModalBody>
            Estás seguro que deseas eliminar {form && form.nombre}
          </ModalBody>
          <ModalFooter>
            <button
              className="btn btn-danger"
              onClick={() => this.eliminaProducto()}
            >
              Sí
            </button>
            <button
              className="btn btn-secundary"
              onClick={() => this.setState({ modalEliminar: false })}
            >
              No
            </button>
          </ModalFooter>
        </Modal>

        <Modal isOpen={this.state.modalValida}>
          <ModalBody>
            Todos los campos son requeridos
          </ModalBody>
          <ModalFooter>
            <button
              className="btn btn-secundary"
              onClick={() => this.setState({ modalValida: false })}
            >
              Ok
            </button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}
export default App;
