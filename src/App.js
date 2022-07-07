//@ts-nocheck
import React, {useState, useEffect} from 'react';
import {Table, Container, Row, Col,
  Button, ButtonGroup, Form, Nav, Navbar} from 'react-bootstrap';
import axios from 'axios';  
import {toast,ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

//const api = 'http://localhost:5000/users';

const initialState = {
  nama:"",
  jumalah:"",
  keterangan:"",
  tanggal:""
};

function App() {
  const [state, setState]= useState(initialState);
  const [data, setData] = useState([]);
  const [userId, setUserId] = useState(null);
  const [editMode, setEditMode] = useState(false);

  const {nama,jumlah,keterangan,tanggal} = state;

  useEffect(() =>{
    loadUsers();
  },[])

  //function load user
  const loadUsers = async () =>{
    const devEnv = process.env.NODE_ENV !== "production";
    const {REACT_APP_DEV_URL, REACT_APP_PROD_URL} = process.env;
    const response = await axios.get(
      `${devEnv?REACT_APP_DEV_URL : REACT_APP_PROD_URL}`);
    setData(response.data);
  };

  //function input user  
  const handleChange = (e) =>{
    let {name, value} = e.target;
    setState({ ...state, [name]:value})
  };

  //function delete user
  const handleDelete = async (id) =>{
    if(window.confirm("Ciuss di Hapus?")){
      const devEnv = process.env.NODE_ENV !== "production";
       const {REACT_APP_DEV_URL, REACT_APP_PROD_URL} = process.env;
      axios.delete(`${devEnv?REACT_APP_DEV_URL : REACT_APP_PROD_URL}/${id}`);
      toast.success("User berhasil dihapus");
      setTimeout(() =>loadUsers(), 400) ;
    }
  };

  //function update user
  const handleUpdate = (id) =>{
    const singleUser = data.find((item) => item.id == id);
    setState({...singleUser});
    setUserId(id);
    setEditMode(true);
  };

  //function submit user
  const handleSubmit = (e)=>{
    e.preventDefault();
    if(!nama || !jumlah || !keterangan || !tanggal){
      toast.error("Mohon isi dengan lengkap")
    }else{
      if(!editMode){
        const devEnv = process.env.NODE_ENV !== "production";
        const {REACT_APP_DEV_URL, REACT_APP_PROD_URL} = process.env;
        axios.post(`${devEnv?REACT_APP_DEV_URL : REACT_APP_PROD_URL}`, state);
        toast.success("Input berhasil");
        setState({nama:"", jumlah:"", keterangan:"", tanggal:""});
        setTimeout(() =>loadUsers(), 400);
      } else{
        const devEnv = process.env.NODE_ENV !== "production";
        const {REACT_APP_DEV_URL, REACT_APP_PROD_URL} = process.env;
        axios.put(`${devEnv?REACT_APP_DEV_URL : REACT_APP_PROD_URL}
                /${userId}`, state);
        toast.success("Update berhasil");
        setState({nama:"", jumlah:"", keterangan:"", tanggal:""});
        setTimeout(() =>loadUsers(), 400);
        setUserId(null);
        setEditMode(false);
      }

    }
  };
  return (
    <>
      <ToastContainer/>
      <Navbar bg="primary" variant="dark" className="justify-content-center">
        <Navbar.Brand>
          STOK GUDANG BARANG
        </Navbar.Brand>
      </Navbar>
      <Container style={{marginTop:"70px"}}>
        <Row>
          <Col md={4}>
            <Form onSubmit={handleSubmit}>
              <Form.Group>
               <Form.Label style={{textAlign:"left"}}>Nama</Form.Label>
                <Form.Control type="text" placeholder='Masukan nama ' name='nama' value={nama} onChange={handleChange}/>
              </Form.Group> 
              <Form.Group>
               <Form.Label style={{textAlign:"left"}}>jumlah</Form.Label>
                <Form.Control type="text" placeholder='Masukan jumlah' name='jumlah' value={jumlah} onChange={handleChange}/>
              </Form.Group> 
              <Form.Group>
               <Form.Label style={{textAlign:"left"}}>keterangan</Form.Label>
                <Form.Control type="text" placeholder='Masukan keterangan' name='keterangan' value={keterangan} onChange={handleChange}/>
              </Form.Group>
              <Form.Group>
               <Form.Label style={{textAlign:"left"}}>tanggal</Form.Label>
                <Form.Control type="text" placeholder='Masukan tanggal' name='tanggal' value={tanggal} onChange={handleChange}/>
              </Form.Group> 
              <div className='d-grid gap-2 mt-2'>
                <Button type='submit' variant='primary' size='1g'>
                  {editMode ? "Update" : "Submit"}
                </Button>
              </div>
            </Form>
          </Col>
          <Col md={8}>
            <Table bordered hover>
              <thead>
                <tr>
                  <th>No.</th>
                  <th>Nama barang</th>
                  <th>Jumlah</th>
                  <th>Keterangan</th>
                  <th>tanggal</th>
                  <th>Action</th>
                </tr>
              </thead>
              {data && data.map((item, index)=>(
                <tbody key={index}>
                  <tr>
                    <td>{index+1}</td>
                    <td>{item.nama}</td>
                    <td>{item.jumlah}</td>
                    <td>{item.keterangan}</td>
                    <td>{item.tanggal}</td>
                    <td>
                      <ButtonGroup>
                        <Button style={{marginRight:"5px"}} variant="secondary" onClick={() => handleUpdate(item.id)}>
                          Update
                        </Button>
                        <Button style={{marginRight:"5px"}} variant="danger" onClick={() => handleDelete(item.id)}>
                          Delete
                        </Button>
                      </ButtonGroup>
                    </td>
                  </tr>
                </tbody>
              ))}
            </Table>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default App;
