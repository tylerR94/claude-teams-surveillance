const chokidar = require('chokidar');
const fs = require('fs');
const path = require('path');
const os = require('os');

class ClaudeTeamWatcher {
  constructor(eventEmitter) {
    this.eventEmitter = eventEmitter;
    this.teamsPath = path.join(os.homedir(), '.claude', 'teams');
    this.tasksPath = path.join(os.homedir(), '.claude', 'tasks');
    this.watchers = [];
  }

  start() {
    console.log('🔍 Starting Claude team watcher...');
    console.log(`   Teams: ${this.teamsPath}`);
    console.log(`   Tasks: ${this.tasksPath}`);

    // Ensure directories exist
    this.ensureDirectories();

    // Watch teams directory
    const teamsWatcher = chokidar.watch(this.teamsPath, {
      persistent: true,
      ignoreInitial: false,
      depth: 3,
      awaitWriteFinish: {
        stabilityThreshold: 100,
        pollInterval: 50
      }
    });

    // Watch tasks directory
    const tasksWatcher = chokidar.watch(this.tasksPath, {
      persistent: true,
      ignoreInitial: false,
      depth: 2,
      awaitWriteFinish: {
        stabilityThreshold: 100,
        pollInterval: 50
      }
    });

    teamsWatcher
      .on('add', (filePath) => this.handleTeamFileChange('add', filePath))
      .on('change', (filePath) => this.handleTeamFileChange('change', filePath))
      .on('unlink', (filePath) => this.handleTeamFileChange('unlink', filePath));

    tasksWatcher
      .on('add', (filePath) => this.handleTaskFileChange('add', filePath))
      .on('change', (filePath) => this.handleTaskFileChange('change', filePath))
      .on('unlink', (filePath) => this.handleTaskFileChange('unlink', filePath));

    this.watchers.push(teamsWatcher, tasksWatcher);
    console.log('✅ Watcher started successfully\n');
  }

  ensureDirectories() {
    [this.teamsPath, this.tasksPath].forEach(dir => {
      if (!fs.existsSync(dir)) {
        console.log(`📁 Creating directory: ${dir}`);
        fs.mkdirSync(dir, { recursive: true });
      }
    });
  }

  handleTeamFileChange(event, filePath) {
    const relativePath = path.relative(this.teamsPath, filePath);
    const parts = relativePath.split(path.sep);

    if (parts.length < 2) return;

    const teamName = parts[0];
    const fileName = parts[parts.length - 1];

    // Handle config.json changes
    if (fileName === 'config.json') {
      const data = this.readJsonFile(filePath);
      if (data) {
        this.eventEmitter.emit('team:update', {
          event,
          teamName,
          config: data,
          timestamp: new Date().toISOString()
        });
      }
    }

    // Handle inbox messages
    if (parts.includes('inboxes') && fileName.endsWith('.json')) {
      const agentName = fileName.replace('.json', '');
      const data = this.readJsonFile(filePath);
      if (data) {
        this.eventEmitter.emit('message:new', {
          event,
          teamName,
          agentName,
          messages: data,
          timestamp: new Date().toISOString()
        });
      }
    }
  }

  handleTaskFileChange(event, filePath) {
    const relativePath = path.relative(this.tasksPath, filePath);
    const parts = relativePath.split(path.sep);

    if (parts.length < 2) return;

    const teamName = parts[0];
    const fileName = parts[parts.length - 1];

    if (fileName.endsWith('.json')) {
      const data = this.readJsonFile(filePath);
      if (data) {
        this.eventEmitter.emit('task:update', {
          event,
          teamName,
          fileName,
          task: data,
          timestamp: new Date().toISOString()
        });
      }
    }
  }

  readJsonFile(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(content);
    } catch (error) {
      // Ignore parse errors (file might be mid-write)
      return null;
    }
  }

  getActiveTeams() {
    const teams = [];

    if (!fs.existsSync(this.teamsPath)) {
      return teams;
    }

    const teamDirs = fs.readdirSync(this.teamsPath);

    for (const teamName of teamDirs) {
      const teamDir = path.join(this.teamsPath, teamName);
      const configPath = path.join(teamDir, 'config.json');

      if (fs.existsSync(configPath)) {
        const config = this.readJsonFile(configPath);
        if (config) {
          teams.push({
            name: teamName,
            config,
            tasks: this.getTeamTasks(teamName),
            messages: this.getTeamMessages(teamName)
          });
        }
      }
    }

    return teams;
  }

  getTeamTasks(teamName) {
    const taskDir = path.join(this.tasksPath, teamName);
    const tasks = [];

    if (!fs.existsSync(taskDir)) {
      return tasks;
    }

    const taskFiles = fs.readdirSync(taskDir).filter(f => f.endsWith('.json'));

    for (const taskFile of taskFiles) {
      const taskPath = path.join(taskDir, taskFile);
      const task = this.readJsonFile(taskPath);
      if (task) {
        tasks.push(task);
      }
    }

    return tasks;
  }

  getTeamMessages(teamName) {
    const inboxDir = path.join(this.teamsPath, teamName, 'inboxes');
    const messages = {};

    if (!fs.existsSync(inboxDir)) {
      return messages;
    }

    const inboxFiles = fs.readdirSync(inboxDir).filter(f => f.endsWith('.json'));

    for (const inboxFile of inboxFiles) {
      const agentName = inboxFile.replace('.json', '');
      const inboxPath = path.join(inboxDir, inboxFile);
      const inbox = this.readJsonFile(inboxPath);
      if (inbox) {
        messages[agentName] = inbox;
      }
    }

    return messages;
  }

  stop() {
    console.log('Stopping watchers...');
    this.watchers.forEach(watcher => watcher.close());
  }
}

module.exports = ClaudeTeamWatcher;
