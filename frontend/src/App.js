import React, { useState, useEffect, useRef } from 'react';
import Alert from 'react-bootstrap/Alert';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Overlay from 'react-bootstrap/Overlay';
import Tooltip from 'react-bootstrap/Tooltip';
import './App.css';
import generateId from './utils.js';

const App = () => {
  const [notes, setNotes] = useState([]);
  let [count, setCount] = useState(notes.length);

  useEffect(() => {
    const mountedNotes = JSON.parse(localStorage.getItem('notes'));
    if (mountedNotes) {
      setNotes(mountedNotes);
      setCount(mountedNotes.length);
    }
  }, []);

  const [show, setShow] = useState(false);
  const target = useRef(null);
  const [showToolip, setShowToolip] = useState(false);
  let [titleNote, setTitleNote] = useState('');
  let [editId, setEditId] = useState('');
  let [contentNote, setContentNote] = useState('');
  const [isNewNote, setNewNote] = useState(false);

  const handleClose = () => setShow(false);

  const handleTitleNote = (e) => {
    titleNote = e.target.value;
    setTitleNote(titleNote);
  };

  const handleContentNote = (e) => {
    contentNote = e.target.value;
    setContentNote(contentNote);
  };

  const handleNewNote = () => {
    setShow(true);
    setEditId(generateId());
    setNewNote(true);
  };

  const handleSaveNote = () => {
    if (titleNote === '' || contentNote === '') {
      setShowToolip(true);
      return;
    }
    setShowToolip(false);
    const newNote = {
      id: editId,
      title: titleNote,
      content: contentNote,
    };
    if (isNewNote) {
      notes.unshift(newNote);
      localStorage.setItem('notes', JSON.stringify(notes));
      setCount(count+=1);
      setShow(false);
      setTitleNote('');
      setContentNote('');
      setNewNote(false);
      return;
    }
    const editedNotes = notes.map((note) => note.id === editId ? newNote : note);
    setNotes(editedNotes);
    localStorage.setItem('notes', JSON.stringify(notes));
    setEditId('');
    setTitleNote('');
    setContentNote('');
    setShow(false);
  };

  const handleRemoveNote = (e) => {
    const id = e.target.id;
    const filteredNotes = notes.filter((note) => note.id !== id);
    setNotes(filteredNotes);
    localStorage.setItem('notes', JSON.stringify(filteredNotes));
    setCount(count-=1);
  };

  const handleEditNote = (e) => {
    setShow(true);
    const id = (e.target.id).slice(3, 6);
    setEditId(id);
    const editedNote = notes.filter((note) => String(note.id) === String(id));
    setTitleNote(editedNote[0].title);
    setContentNote(editedNote[0].content);
  };

  return (
    <>
      <Alert key='primary' variant='primary'>
        <Container>
          <Row>
            <Col sm={6}>
              <h1>
                Мои заметки
              </h1>
            </Col>
            <Col sm={3}>
              <h4>
                Всего заметок:{` ${count}`}
              </h4>
            </Col>
            <Col sm={3}>
              <Button
              size="lg"
              variant="primary"
              onClick={handleNewNote}>
                Добавить
              </Button>{' '}
            </Col>
          </Row>
        </Container>
      </Alert>

      {
        notes.length !== 0 && notes.map((note) => {
          return (
            <Alert key={note.id} variant='secondary'>
              <Container>
                <Row>
                  <Col sm={8}>
                    <h4>
                      {note.title}
                    </h4>
                  </Col>
                  <Col sm={2}>
                    <Button variant="success"
                    id={`edt${note.id}`}
                    onClick={(e) => handleEditNote(e)}
                    >
                      Редактировать
                    </Button>{' '}
                  </Col>
                  <Col sm={2}>
                    <Button
                    id={note.id}
                    variant="outline-danger"
                    onClick={(e) => handleRemoveNote(e)}
                    >
                      Удалить
                    </Button>{' '}
                  </Col>
                </Row>
                <Row>
                  <h5>
                    {note.content}
                  </h5>
                </Row>
              </Container>
            </Alert>
          );
        })
      }

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Делаем что-то с заметкой</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Название заметки</Form.Label>
              <Form.Control
                type="email"
                placeholder="Название заметки"
                autoFocus
                value={titleNote}
                onChange={(e) => handleTitleNote(e)}
              />
            </Form.Group>
            <Form.Group
              className="mb-3"
              controlId="exampleForm.ControlTextarea1"
            >
              <Form.Label>Содержимое заметки</Form.Label>
              <Form.Control as="textarea" rows={3}
              value={contentNote}
              onChange={(e) => handleContentNote(e)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Выйти
          </Button>
          <Button variant="primary" ref={target} onClick={handleSaveNote}>
            Сохранить
          </Button>
          <Overlay target={target.current} show={showToolip} placement="top">
            {(props) => (
              <Tooltip id="overlay-example" {...props}>
                Что-то не заполнено
              </Tooltip>
            )}
      </Overlay>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default App;
