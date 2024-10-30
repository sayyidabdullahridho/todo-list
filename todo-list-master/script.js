export default class TodoApp {
    constructor() {
      // Menangkap elemen form dan daftar to-do dari DOM
      this.todoForm = document.getElementById('todo-form');
      this.todoList = document.getElementById('todo-list');
      this.newTaskInput = document.getElementById('new-task');
  
      // Tombol filter
      this.allTasksBtn = document.getElementById('all-tasks');
      this.activeTasksBtn = document.getElementById('active-tasks');
      this.completedTasksBtn = document.getElementById('completed-tasks');
  
      // Event listeners untuk form dan filter tombol
      this.todoForm.addEventListener('submit', (e) => this.addNewTask(e));
      this.allTasksBtn.addEventListener('click', () => this.filterTasks('all'));
      this.activeTasksBtn.addEventListener('click', () => this.filterTasks('active'));
      this.completedTasksBtn.addEventListener('click', () => this.filterTasks('completed'));
  
      // Muat tugas dari localStorage saat halaman dimuat
      document.addEventListener('DOMContentLoaded', () => this.loadTasksFromLocalStorage());
    }
  
    // Fungsi untuk menambahkan tugas baru
    addNewTask(e) {
      e.preventDefault(); // Mencegah reload halaman
      const taskText = this.newTaskInput.value;
  
      if (taskText !== '') {
        this.addTaskToDOM(taskText);
        this.saveTaskToLocalStorage(taskText);
        this.newTaskInput.value = ''; // Reset input setelah menambahkan tugas
      }
    }
  
    // Fungsi untuk menambahkan tugas ke dalam DOM
    addTaskToDOM(taskText, isCompleted = false) {
      const newTask = document.createElement('li');
      newTask.classList.add('todo-item');
  
      // Membuat elemen teks tugas
      const taskContent = document.createElement('span');
      taskContent.textContent = taskText;
      if (isCompleted) taskContent.classList.add('completed');
  
      // Membuat tombol 'Hapus'
      const deleteButton = document.createElement('button');
      deleteButton.textContent = 'Delete';
      deleteButton.classList.add('remove-btn');
  
      // Event listener untuk menandai tugas selesai
      taskContent.addEventListener('click', () => {
        taskContent.classList.toggle('completed');
        this.updateTaskStatusInLocalStorage(taskText);
      });
  
      // Event listener untuk tombol 'Hapus'
      deleteButton.addEventListener('click', () => {
        newTask.remove();
        this.removeTaskFromLocalStorage(taskText);
      });
  
      newTask.appendChild(taskContent);
      newTask.appendChild(deleteButton);
      this.todoList.appendChild(newTask);
    }
  
    // Fungsi untuk menyimpan tugas ke localStorage
    saveTaskToLocalStorage(taskText) {
      let tasks = this.getTasksFromLocalStorage();
      tasks.push({ text: taskText, completed: false });
      localStorage.setItem('tasks', JSON.stringify(tasks));
    }
  
    // Fungsi untuk memuat tugas dari localStorage
    loadTasksFromLocalStorage() {
      let tasks = this.getTasksFromLocalStorage();
      tasks.forEach((task) => this.addTaskToDOM(task.text, task.completed));
    }
  
    // Fungsi untuk mendapatkan tugas dari localStorage
    getTasksFromLocalStorage() {
      let tasks = localStorage.getItem('tasks');
      return tasks ? JSON.parse(tasks) : [];
    }
  
    // Fungsi untuk memperbarui status tugas di localStorage
    updateTaskStatusInLocalStorage(taskText) {
      let tasks = this.getTasksFromLocalStorage();
      tasks.forEach((task) => {
        if (task.text === taskText) {
          task.completed = !task.completed;
        }
      });
      localStorage.setItem('tasks', JSON.stringify(tasks));
    }
  
    // Fungsi untuk menghapus tugas dari localStorage
    removeTaskFromLocalStorage(taskText) {
      let tasks = this.getTasksFromLocalStorage();
      tasks = tasks.filter((task) => task.text !== taskText);
      localStorage.setItem('tasks', JSON.stringify(tasks));
    }
  
    // Fungsi untuk memfilter tugas yang akan ditampilkan
    filterTasks(filter) {
      const tasks = document.querySelectorAll('.todo-item');
  
      tasks.forEach((task) => {
        const taskContent = task.querySelector('span');
  
        switch (filter) {
          case 'all':
            task.style.display = 'flex';
            break;
          case 'active':
            task.style.display = taskContent.classList.contains('completed') ? 'none' : 'flex';
            break;
          case 'completed':
            task.style.display = taskContent.classList.contains('completed') ? 'flex' : 'none';
            break;
        }
      });
    }
  }
  
  // Inisialisasi aplikasi saat dokumen siap
  document.addEventListener('DOMContentLoaded', () => {
    new TodoApp();
  });