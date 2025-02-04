import tape from "tape";
import SystemsManager from "../SystemsManager.js";

tape("SystemsManager - add and dispatch message processor", (t) => {
  const sm = new SystemsManager();
  let receivedMessage = null;

  sm.addMessageProcessor("test", (message) => {
    receivedMessage = message;
  });

  sm.dispatchMessage("test", "Hello, World!");

  t.equal(receivedMessage, "Hello, World!", "Message processor should receive dispatched message");
  t.end();
});

tape("SystemsManager - remove message processor", (t) => {
  const sm = new SystemsManager();
  let receivedMessage = null;

  function processor(message) {
    receivedMessage = message;
  }

  sm.addMessageProcessor("test", processor);
  sm.removeMessageProcessor("test", processor);
  sm.dispatchMessage("test", "Hello, World!");

  t.equal(receivedMessage, null, "Removed message processor should not receive messages");
  t.end();
});

tape("SystemsManager - dispatch with no processors", (t) => {
  const sm = new SystemsManager();
  sm.dispatchMessage("nonexistent", "Hello, World!");
  t.pass("No error should be thrown when dispatching to an unregistered message type");
  t.end();
});

tape("SystemsManager - multiple processors for the same message type", (t) => {
  const sm = new SystemsManager();
  let messages = [];

  function processor1(msg) {
    messages.push(`proc1: ${msg}`);
  }
  function processor2(msg) {
    messages.push(`proc2: ${msg}`);
  }

  sm.addMessageProcessor("test", processor1);
  sm.addMessageProcessor("test", processor2);
  sm.dispatchMessage("test", "Hello");

  t.deepEqual(messages, ["proc1: Hello", "proc2: Hello"], "Both processors should receive the message");
  t.end();
});

tape("SystemsManager - re-adding the same processor does not duplicate calls", (t) => {
  const sm = new SystemsManager();
  let callCount = 0;

  function processor() {
    callCount++;
  }

  sm.addMessageProcessor("test", processor);
  sm.addMessageProcessor("test", processor); // Adding the same function again
  sm.dispatchMessage("test", "Message");

  t.equal(callCount, 2, "Processor should be called for each registration");
  t.end();
});

tape("SystemsManager - removing a non-existent processor should not throw errors", (t) => {
  const sm = new SystemsManager();
  
  function processor() {}

  sm.removeMessageProcessor("test", processor); // Removing before adding
  t.pass("Removing a processor that was never added should not throw an error");
  t.end();
});

tape("SystemsManager - ensuring different message types do not interfere", (t) => {
  const sm = new SystemsManager();
  let testMessage = null;
  let otherMessage = null;

  sm.addMessageProcessor("test", (msg) => {
    testMessage = msg;
  });

  sm.addMessageProcessor("other", (msg) => {
    otherMessage = msg;
  });

  sm.dispatchMessage("test", "Test Message");

  t.equal(testMessage, "Test Message", "Processor for 'test' should receive the correct message");
  t.equal(otherMessage, null, "Processor for 'other' should not receive a 'test' message");
  t.end();
});

tape("SystemsManager - adding and removing multiple processors dynamically", (t) => {
  const sm = new SystemsManager();
  let messages = [];

  function processor1(msg) {
    messages.push(`proc1: ${msg}`);
  }
  function processor2(msg) {
    messages.push(`proc2: ${msg}`);
  }

  sm.addMessageProcessor("test", processor1);
  sm.addMessageProcessor("test", processor2);
  sm.removeMessageProcessor("test", processor1);
  sm.dispatchMessage("test", "Hello");

  t.deepEqual(messages, ["proc2: Hello"], "Only processor2 should receive the message after processor1 is removed");
  t.end();
});

tape("SystemsManager - dispatching to an empty processor list should do nothing", (t) => {
  const sm = new SystemsManager();
  let receivedMessage = null;

  function processor(message) {
    receivedMessage = message;
  }

  sm.addMessageProcessor("test", processor);
  sm.removeMessageProcessor("test", processor);
  sm.dispatchMessage("test", "Hello");

  t.equal(receivedMessage, null, "No message should be received after all processors are removed");
  t.end();
});
