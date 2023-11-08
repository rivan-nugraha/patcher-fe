import React, { useState } from 'react'
import axios from 'axios';
import {
  InputGroup,
  Form
} from 'react-bootstrap';
import io from 'socket.io-client';
import './style.css'


const LandingPage = () => {
  const [output, setOutput] = useState([]);
  const [file, setFile] = useState();
  const [readOnly, setReadOnly] = useState();
  const [status, setStatus] = useState("Ready");
  
  
  const onFileChange = (e) => {
    setReadOnly(true);
    setStatus("On Running");
    const socket = new io(`${process.env.REACT_APP_ENV_IP_BE}`)
      setOutput([]);
      const file = e.target.files[0];
      setFile(file);
  
      const formData = new FormData();
      formData.append('file', file);
      socket.on('pythonOutput', (data) => {
        setOutput((prevOutput) => [...prevOutput, data]);
      });
      axios
        .post(`${process.env.REACT_APP_ENV_IP_BE}/upload`, formData)
        .then((response) => {
          setReadOnly(false);
          setStatus("Ready");
          socket.disconnect();
          alert('Script Success Running.');
          document.getElementById("reset").reset();
        })
        .catch((error) => {
          setReadOnly(false);
          setStatus("Ready");
          socket.disconnect();
          document.getElementById("reset").reset();
          alert('Script Error: ' + error);
        });
    };

    window.setInterval(function () {
      if(readOnly){
        var elem = document.getElementById("terminal");
        var scroller = document.getElementById("terminal-box");
        scroller.scrollTop = elem.scrollHeight
      }
    }, 500);

  return (
    <form id='reset'>
      <div className="container vw-100 vh-100 p-4 d-flex flex-column align-items-center">
      <div className="box border p-3 rounded">
        <h3 className='text-center mb-3'>Patcher Python Script</h3>
        <InputGroup className="mt-2">
          <Form.Control
            disabled={readOnly}
            type='file'
            placeholder="Script Python"
            aria-label="Script Python"
            aria-describedby="basic-addon1"
            onChange={onFileChange}
          />
        </InputGroup>
      </div>
      <div className="box mt-5 border w-100 h-75 p-3 rounded">
        <h3 className='text-center mt-3'>Terminal Output</h3>
        <div className='mt-2 h-75 w-100'>
          <div id="terminal-box" className='bg-dark w-100 h-100 p-3 rounded overflow-scroll'>
            {
              file
                ? <pre id='terminal' className='terminal'>{output.join('\n')}</pre>
                : <pre id='terminal' className='terminal'>Add File Python On Input</pre>
            }
          </div>
          <p className='m-2'>Status: {status}</p>
        </div>
      </div>
    </div>
    </form>
  )
}

export default LandingPage