import './App.css';
import { useState } from 'react';
import Axios from 'axios';
import swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import 'bootstrap/dist/css/bootstrap.min.css';

const notify = withReactContent(swal);

function App() {

  //se declaran las variables que se van a usar en el metodo post.
  const [nombre, setNombre] = useState("");
  const [edad, setEdad] = useState();
  const [pais, setPais] = useState("");
  const [cargo, setCargo] = useState("");
  const [anios, setAnios] = useState();
  const [id, setId] = useState();

  //se declara la variable donde se va a actualizar el registro
  const [empleadosUpdate, setUpdate] = useState(false);

  //se declara la variable donde se va a guardar el listado del metodo get.
  const [empleadosList, setList] = useState([]);

  //la funcion que se usa para guardar o insertar el empleado.
  const add = () =>{
    Axios.post("http://localhost:3001/create",{
      nombre: nombre,
      edad: edad,
      pais: pais,
      cargo: cargo,
      anios: anios,
    }).then(()=>{
      list();
      clear();
      notification("Empleado Registrado!", 'success');
    }).catch(function(error){
      notificationError('Oops....', 'error', error.message );
    });
  };

  //la funcion para listar los empleados.
  const list = () =>{
    Axios.get("http://localhost:3001/list").then((response)=>{
      setList(response.data);
    }).catch(function(error){
      notificationError('Oops....', 'error', error.message );
    });
  }
  //funcion sirve para setear los valores en el formulario para actualizar
  const setValue = ( value )=>{
    setUpdate( true );
    setNombre( value.nombre );
    setEdad( value.edad );
    setPais( value.pais );
    setCargo( value.cargo );
    setAnios( value.anios );
    setId( value.id );
  }
  //limpia el formulario presionando el boton de cancelar
  const clear = () =>{
    setUpdate( false );
    setNombre( "" );
    setEdad( "" );
    setPais( "" );
    setCargo( "" );
    setAnios( "" );
    setId( "" );
  }
  const update = () =>{
    Axios.put("http://localhost:3001/update",{
      id: id,
      nombre: nombre,
      edad: edad,
      pais: pais,
      cargo: cargo,
      anios: anios,
    }).then(()=>{
      list();
      clear();
      notification("Empleado Actualizado!", 'success');
    }).catch(function(error){
      notificationError('Oops....', 'error', error.message );
    });
  };

  const deleted = ( value ) =>{

    notify.fire({
      title: '<strong>Esta seguro de eliminar?</strong>',
      //html: <i>Click en el boton</i>,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si',
    }).then((result)=>{
      if(result.isConfirmed){
        Axios.delete(`http://localhost:3001/delete/${value.id}`).then(()=>{
          list();
          clear();
          notification("Empleado Eliminado!", 'success');
        }).catch(function(error){
          notificationError('Oops....', 'error', error.message );
        });
      }
    });
  };

  const notification = ( title, icon ) =>{
    notify.fire({
      title: '<strong>'+title+'</strong>',
      //html: <i>Click en el boton</i>,
      icon: icon,
      timer: 3000,
    });
  }

  const notificationError = ( title, icon, html ) =>{
    notify.fire({
      title: '<strong>'+title+'</strong>',
      html: '<i>'+html+'</i>',
      icon: icon,
    });
  }

  list();

  return (
    <div className='container'>
      <div className='card text-center'>
        <div className='card-header'>
            GESTION DE EMPLEADOS
        </div>
        <div className='card-body'>
          <div className='input-group mb3'>
            <span className='input-group-text' id='basic-addon1'>Nombre:</span>
            <input type='text' 
            onChange={(event)=>{
              setNombre(event.target.value);
            }}
            className='form-control' placeholder='Nombre' value={ nombre } aria-label='Nombre' aria-describedby='basic-addon1'/>
          </div>

          <div className='input-group mb3'>
            <span className='input-group-text' id='basic-addon1'>Edad:</span>
            <input type='number' 
            onChange={(event)=>{
              setEdad(event.target.value);
            }}
            className='form-control' placeholder='Edad' aria-label='Edad' value={ edad } aria-describedby='basic-addon1'/>
          </div>

          <div className='input-group mb3'>
            <span className='input-group-text' id='basic-addon1'>Pais:</span>
            <input type='text' 
            onChange={(event)=>{
              setPais(event.target.value);
            }}
            className='form-control' placeholder='Pais' aria-label='Pais' value={ pais } aria-describedby='basic-addon1'/>
          </div>

          <div className='input-group mb3'>
            <span className='input-group-text' id='basic-addon1'>Cargo:</span>
            <input type='text' 
            onChange={(event)=>{
              setCargo(event.target.value);
            }}
            className='form-control' placeholder='Cargo' aria-label='Cargo' value={ cargo } aria-describedby='basic-addon1'/>
          </div>

          <div className='input-group mb3'>
            <span className='input-group-text' id='basic-addon1'>Años:</span>
            <input type='number' 
            onChange={(event)=>{
              setAnios(event.target.value);
            }}
            className='form-control' placeholder='Años' aria-label='Años' value={ anios } aria-describedby='basic-addon1'/>
          </div>
          
        </div>
        <div className='card-footer text-muted'>
          {
             empleadosUpdate?
             <div>
              <button className='btn btn-warning' onClick={ update }>Actualizar</button>{" "} 
              <button className='btn btn-danger' onClick={ clear }>Cancelar</button>
             </div>
             :<button className='btn btn-success' onClick={ add }>Registrar</button>
          }
          
        </div>
      </div>
      <table className='table table-striped'>
        <thead>
          <tr>
            <th scope='col'>#</th>
            <th scope='col'>Nombre</th>
            <th scope='col'>Edad</th>
            <th scope='col'>Pais</th>
            <th scope='col'>Cargo</th>
            <th scope='col'>Años</th>
            <th scope='col'>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {
            empleadosList.map((val, key)=>{
              return <tr key={ val.id }>
                       <th scope='row'>{ val.id }</th>
                       <th scope='row'>{ val.nombre }</th>
                       <th scope='row'>{ val.edad }</th>
                       <th scope='row'>{ val.pais }</th>
                       <th scope='row'>{ val.cargo }</th>
                       <th scope='row'>{ val.anios }</th>
                       <th scope='row'>
                        <div className='btn-group' role='group' aria-label='Basic example'>
                          <button className='btn btn-info' type='button'
                          onClick={()=>{
                            setValue(val);
                           }  
                          }
                          >Editar</button>
                          <button className='btn btn-danger' type='button'
                          onClick={()=>{
                            deleted(val);
                          }}>Eliminar</button>
                        </div>
                       </th>
                     </tr>
            })
          }
          
        </tbody>
      </table>
    </div>
  );
}

export default App;
