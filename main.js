const tasks = []; //arreglo vacio
let time=0; //lleva la cuenta regresiva
let timer= null; // se asocia a una variable para exe un cod. cada x tiempo
let timerBreak= null; // otro para los 5 minutos de descanso
let current= null; //cual es la tarea actual que se esta exe.

// referencia a los elementos html
const bAdd= document.querySelector('#bAdd');
const itTask= document.querySelector('#itTask');
const form= document.querySelector('#form');
const taskName = document.querySelector('#time #taskName');


renderTime();
renderTasks();


// eventos 
form.addEventListener('submit', e=> {
    // anulamos el funcionamiento nativo, no se envia el formulario 
    e.preventDefault();
    if(itTask.value != ""){
        createTask(itTask.value);
        itTask.value= "";
        renderTasks();
    }
});

// creamos la funcion createTask 
function createTask(value){
    const newTask ={
        id: (Math.random() * 100).toString(36).slice(3),
        title: value,
        completed: false
    };
    tasks.unshift(newTask);

}

function renderTasks(){
    const html = tasks.map(task => {
        return `
            <div class="task">
                <div class="completed">${task.completed ? `<span class="done">Done</span>` :`<button class="start-button" data-id="${task.id}">Start</button>`}</div>
                <div class="title">${task.title}</div>
            </div>
        `;
    });

    const tasksContainer = document.querySelector('#tasks');
    tasksContainer.innerHTML= html.join('');

    // los botones 
    const startButtons = document.querySelectorAll('.task .start-button');

    startButtons.forEach(button => {
        button.addEventListener('click', e=> {
            if(!timer ){
                const id= button.getAttribute('data-id');
                startButtonHandler(id);
                button.textContent= "In progress...";
            }
        });
    });
}

// definimos la funcion startbutton 
function startButtonHandler(id){
// calculamos los 25 min de la actividad principal 
    time = 25* 60;
    current = id;
    const taskIndex= tasks.findIndex(task => task.id == id);
    taskName.textContent= tasks[taskIndex].title;

    renderTime();

    // le damos formato al tiempo 
    timer = setInterval(()=> {
        timerHandler(id);
    }, 1000);
}

function timerHandler(id){
    time--;
    renderTime();

    if(time == 0){
        clearInterval(timer);
        markCompleted(id);
        timer = null;
        renderTasks();
        startBreak();
    }
}

function startBreak(){
    time= 10* 60;
    taskName.textContent= "Break";
    renderTime();
    timerBreak= setInterval(()=>{
        timerBreakHandler();
    }, 1000 );
}

function timerBreakHandler(){
    time--;
    renderTime();

    if(time ==0){
        clearInterval(timerBreak);
        current= null;
        timerBreak= null;
        taskName.textContent= "";
        renderTasks();
    }
}

function renderTime(){
    const timeDiv= document.querySelector('#time #value');
    const minutes= parseInt(time / 60);
    const seconds= parseInt(time % 60);

    timeDiv.textContent= `${minutes < 10 ? '0': ''}${minutes}:${seconds < 10 ? '0': ''}${seconds}`;
}

function markCompleted(id){
    const taskIndex = tasks.findIndex((task) => task.id == id);
    tasks[taskIndex].completed = true;
}

