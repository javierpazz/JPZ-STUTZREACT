import React, { useEffect, useRef, useState } from "react";
import socketIOClient from "socket.io-client";

import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import ListGroup from "react-bootstrap/ListGroup";
import Alert from "react-bootstrap/Alert";
import Badge from "react-bootstrap/Badge";
import FormControl from "react-bootstrap/FormControl";
import InputGroup from "react-bootstrap/InputGroup";
import Button from "react-bootstrap/Button";
import {API} from '../utils';

const ENDPOINT =
  window.location.host.indexOf("localhost") >= 0
  // ? "http://127.0.0.101:3000"
     ? `${API}`
     : window.location.host;

export default function SupportScreen() {
  const [selectedUser, setSelectedUser] = useState({});
  const [socket, setSocket] = useState(null);
  const uiMessagesRef = useRef(null);
  const [messageBody, setMessageBody] = useState("");
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  useEffect(() => {
    if (uiMessagesRef.current) {
      uiMessagesRef.current.scrollBy({
        top: uiMessagesRef.current.scrollHeight,
        left: 0,
        behavior: "smooth",
      });
    }
    if (socket) {
      socket.on("message", (data) => {
        if (selectedUser.name === data.from) {
          setMessages([...messages, data]);
        } else {
          const existUser = users.find((user) => user.name === data.from);
          if (existUser) {
            setUsers(
              users.map((user) =>
                user.name === existUser.name ? { ...user, unread: true } : user
              )
            );
          }
        }
      });

      socket.on("updateUser", (updatedUser) => {
        const existUser = users.find((user) => user.name === updatedUser.name);
        if (existUser) {
          setUsers(
            users.map((user) =>
              user.name === existUser.name ? updatedUser : user
            )
          );
        } else {
          setUsers([...users, updatedUser]);
        }
      });
      socket.on("listUsers", (updatedUsers) => {
        setUsers(updatedUsers);
      });

      socket.on("selectUser", (user) => {
        setMessages(user.messages);
      });
    } else {
      const sk = socketIOClient(ENDPOINT);
      setSocket(sk);
      sk.emit("onLogin", {
        name: "Admin",
      });
    }
  }, [messages, selectedUser, socket, users]);

  const selectUser = (user) => {
    setSelectedUser(user);
    const existUser = users.find((x) => x.name === user.name);
    if (existUser) {
      setUsers(
        users.map((x) =>
          x.name === existUser.name ? { ...x, unread: false } : x
        )
      );
    }
    socket.emit("onUserSelected", user);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    if (!messageBody.trim()) {
      alert("Error. Por Favor Escriba un mensaje.");
    } else {
      setMessages([
        ...messages,
        { body: messageBody, from: "Admin", to: selectedUser.name },
      ]);
      setTimeout(() => {
        socket.emit("onMessage", {
          body: messageBody,
          from: "Admin",
          to: selectedUser.name,
        });
      }, 1000);
      setMessageBody("");
    }
  };

  return (
    <Row>
      <Col sm={3}>
        {users.filter((x) => x.name !== "Admin").length === 0 && (
          <Alert variant="info">Cliente no Encontrado</Alert>
        )}
        <ListGroup>
          {users
            .filter((x) => x.name !== "Admin")
            .map((user) => (
              <ListGroup.Item
                action
                key={user.name}
                variant={user.name === selectedUser.name ? "info" : ""}
                onClick={() => selectUser(user)}
              >
                <Badge
                  bg={
                    selectedUser.name === user.name
                      ? user.online
                        ? "primary"
                        : "secondary"
                      : user.unread
                      ? "danger"
                      : user.online
                      ? "primary"
                      : "secondary"
                  }
                >
                  {selectedUser.name === user.name
                    ? user.online
                      ? "Online"
                      : "Offline"
                    : user.unread
                    ? "Nuevo"
                    : user.online
                    ? "Online"
                    : "Offline"}
                </Badge>
                &nbsp;
                {user.name}
              </ListGroup.Item>
            ))}
        </ListGroup>
      </Col>
      <Col sm={9}>
        <div className="admin">
          {!selectedUser.name ? (
            <Alert variant="info">Seleccione un Cliente para Chatear</Alert>
          ) : (
            <div>
              <h2>Chat Con {selectedUser.name}</h2>
              <ListGroup ref={uiMessagesRef}>
                {messages.length === 0 && (
                  <ListGroup.Item>No hay mensajes</ListGroup.Item>
                )}
                {messages.map((msg, index) => (
                  <ListGroup.Item key={index}>
                    <strong>{`${msg.from}: `}</strong> {msg.body}
                  </ListGroup.Item>
                ))}
              </ListGroup>
              <div>
                <form onSubmit={submitHandler}>
                  <InputGroup className="col-6">
                    <FormControl
                      value={messageBody}
                      onChange={(e) => setMessageBody(e.target.value)}
                      type="text"
                      placeholder="Escriba un mensaje"
                    ></FormControl>
                    <Button type="submit" variant="primary">
                      Enviar
                    </Button>
                  </InputGroup>
                </form>
              </div>
            </div>
          )}
        </div>
      </Col>
    </Row>
  );
}
