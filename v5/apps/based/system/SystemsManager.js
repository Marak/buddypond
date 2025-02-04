class SystemsManager {
  constructor() {
    this.messageProcessors = new Map();
  }

  addMessageProcessor(type, processor) {
    if (!this.messageProcessors.has(type)) {
      this.messageProcessors.set(type, []);
    }
    this.messageProcessors.get(type).push(processor);
  }

  removeMessageProcessor(type, processor) {
    if (!this.messageProcessors.has(type)) return;
    
    const processors = this.messageProcessors.get(type).filter(p => p !== processor);
    
    if (processors.length === 0) {
      this.messageProcessors.delete(type);
    } else {
      this.messageProcessors.set(type, processors);
    }
  }

  dispatchMessage(type, message) {
    if (!this.messageProcessors.has(type)) return;
    
    for (const processor of this.messageProcessors.get(type)) {
      processor(message);
    }
  }
}

export default SystemsManager;
