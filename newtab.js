document.addEventListener("DOMContentLoaded", function() {
    var apps = document.getElementById("quote");
    const baseUrl = 'https://api.quotable.io/random' 
    axios.get(baseUrl).then((response)=>{
        var quote = document.createElement("H1");
        console.log(response.data)
        quote.innerHTML = response.data.content;
        apps.appendChild(quote);
    })
    dateTime();
    const addButton = document.getElementById("save");
    addButton.addEventListener('click',add);
    const clearButton = document.getElementById("clearall");
    clearButton.addEventListener('click',clear);
    const nameButton = document.getElementById("tiktok");
    nameButton.addEventListener('click',toggle);
    try{
        chrome.storage.sync.get('todo', function({todo}) {
            //console.log('Value is get to ',toggle);
            todo.push(input.value);
            renderTask(todo)
        })
    }
    catch(err){
        renderTask([]);
    }
});

var dateTime = ()=>{
    var d = new Date();
    document.getElementById("date").innerHTML = d.toDateString();
    document.getElementById("time").innerHTML = d.getHours() + ":"  + d.getMinutes() + ":" + d.getSeconds();;
    setTimeout(dateTime,1000);
}

var add = async()=>{
    const input = document.getElementById("new-todo");
    if(input.value=="")
    return;
    const tasklist = document.getElementById("task-list");
    const newtask = document.createElement("li");
    const id = (+new Date()).toString();
    const check = document.createElement('input');
    check.type = 'checkbox';
    check.id = id;
    const del = document.createElement('div');
    del.innerHTML = "&#10005;";
    del.classList.add('delete-button');
    const label = document.createElement('label');
    label.id = 'label-'+id;
    label.dataset.id = id;
    label.textContent = input.value;
    newtask.appendChild(check);
    newtask.appendChild(label);
    newtask.appendChild(del);
    del.addEventListener('click',()=>{deleteTodo('label-'+id)});
    newtask.className+='task'
    val = input.value
    tasklist.appendChild(newtask);
        try{
            chrome.storage.sync.get('todo', function({todo}) {
                //console.log('Value is get to ',todo);
                if(todo==undefined)
                setValue([val]);
                todo.push(val);
                setValue(todo)
            })
        }
        catch(err){
            setValue([val]);
        }
    input.value="";
}

const setValue = (todos)=>{
    chrome.storage.sync.set({'todo': todos}, function() {
        //console.log('Value is set to ',todos);
    })
}

var renderTask = (todos)=>{
    const tasklist = document.getElementById("task-list");
    todos.forEach(element => {
        if(element!=undefined){
            const newtask = document.createElement("li");
            const id = (+new Date()).toString();
            const check = document.createElement('input');
            check.type = 'checkbox';
            check.id = id;
            const del = document.createElement('div');
            del.innerHTML = "&#10005;";
            del.classList.add('delete-button');
            const label = document.createElement('label');
            label.id = 'label-'+id;
            label.dataset.id = id;
            label.textContent = element;
            newtask.appendChild(check);
            newtask.appendChild(label);
            newtask.appendChild(del);
            del.addEventListener('click',()=>{deleteTodo('label-'+id)});
            newtask.className+='task'
            tasklist.appendChild(newtask);
        }
    });
}
const clear = ()=>{
    chrome.storage.sync.clear(()=>{
        //console.log("cleared");
    });
    const tasklist = document.getElementById("task-list");
    tasklist.innerHTML="";
}

const toggle = ()=>{
    if(document.getElementById("input").style.display=="block")
    document.getElementById("input").style.display = "none";
    else
    document.getElementById("input").style.display = "block";
}

const deleteTodo = (id)=>{
    const label = document.getElementById(id);
    const parent = label.parentNode;
    const d_todo = label.textContent;
    //console.log("del value:",d_todo);
    chrome.storage.sync.get('todo', function({todo}) {
        //console.log('Value is get to:::',todo);
        new_todo = todo.filter(c_todo=>c_todo!=d_todo)
        setValue(new_todo)
    });
    document.getElementById('task-list').removeChild(parent);
}

//chrome.storage.sync.clear();