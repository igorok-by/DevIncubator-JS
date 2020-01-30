// Main js file

document.addEventListener('DOMContentLoaded', (event) => {

  // variables
  const task = (title, priority, time, text) => {
    return `<li class="list-group-item d-flex w-100 mb-2">
      <div class="w-100 mr-2">
        <div class="d-flex w-100 justify-content-between">
          <h5 class="mb-1">${title}</h5>
          <div>
            <small class="mr-2">${priority}</small>
            <small>${time}</small>
          </div>
        </div>
        <p class="mb-1 w-100">${text}</p>
      </div>
      <div class="dropdown m-2 dropleft">
        <button class="btn btn-secondary h-100" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          <i class="fas fa-ellipsis-v" aria-hidden="true"></i>
        </button>
        <div class="dropdown-menu p-2 flex-column" aria-labelledby="dropdownMenuItem">
          <button type="button" class="btn btn-success w-100 complete-js">Complete</button>
          <button type="button" class="btn btn-info w-100 my-2 edit-js">Edit</button>
          <button type="button" class="btn btn-danger w-100 delete-js">Delete</button>
        </div>
      </div>
    </li>`;
  };

  const modal = document.getElementById('exampleModal'),
        form = modal.querySelector('form'),
        btnSortDown = document.getElementById('sortTasksDown'),
        btnSortUp = document.getElementById('sortTasksUp'),
        btnModalHide = modal.querySelectorAll('button[data-dismiss=modal]'),
        btnSubmit = document.querySelector('button[type=submit]'),
        currentTasks = document.getElementById('currentTasks'),
        completedTasks = document.getElementById('completedTasks'),
        btnsComplete = document.getElementsByClassName('complete-js'),
        btnsDelete = document.getElementsByClassName('delete-js'),
        btnsEdit = document.getElementsByClassName('edit-js'),
        priorityInstanceLow = 'Low',
        priorityInstanceMedium = 'Medium',
        priorityInstanceHigh = 'High',
        priorityInstanceAll = 'All';

        
  // functions        
  const handleBtnsCollection = (collection, func) => {
          for (let btn of collection) {
            btn.onclick = () => {
              let taskBlock = btn.closest('.list-group-item');
              func(taskBlock);
            };
          };
        },

        taskToCompleted = (taskBlock) => {
          taskBlock.querySelector('.edit-js').style.display = 'none';
          taskBlock.querySelector('.complete-js').style.display = 'none';
          completedTasks.prepend(taskBlock);
        },
        
        deleteTask = (taskBlock) => {
          taskBlock.remove();
        },

        editTask = (taskBlock) => {
          let inputTitle = document.getElementById('inputTitle'),
              inputText = document.getElementById('inputText'),
              inputRadioLow = document.getElementById('Low'),
              inputRadioMedium = document.getElementById('Medium'),
              inputRadioHigh = document.getElementById('High'),
              priorityHolder = taskBlock.querySelectorAll('small')[0],
              priorityValue = priorityHolder.innerHTML
                                            .split(' ')[0]
                                            .toString(),
              modalBackground = document.createElement('div');
          
          inputTitle.value = taskBlock.querySelector('h5').innerHTML;
          inputText.value = taskBlock.querySelector('p.mb-1.w-100').innerHTML;
              
          switch (priorityValue) {
            case priorityInstanceLow:
              inputRadioLow.checked = true;
              break;
            case priorityInstanceMedium:
              inputRadioMedium.checked = true;
              break;
            case priorityInstanceHigh:
              inputRadioHigh.checked = true;
              break;
          };
              
          modalBackground.classList.add('modal-backdrop', 'fade', 'show');
          document.body.append(modalBackground);
          modal.style.display = 'block';
          modal.classList.add('show');
          btnSubmit.innerHTML = 'Save';

          for (btn of btnModalHide) {
            btn.addEventListener('click', () => {
              modalBackground.remove();
              modal.style.display = 'none';
              modal.classList.remove('show');
              btnSubmit.innerHTML = 'Add task';
              form.reset();
            });
          };

          btnSubmit.addEventListener('click', () => {
            taskBlock.remove();
          });
        };

  handleBtnsCollection(btnsComplete, taskToCompleted);
  handleBtnsCollection(btnsDelete, deleteTask);
  handleBtnsCollection(btnsEdit, editTask);


  // add task from modal
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    
    let valTitle = document.getElementById('inputTitle').value,
        valText = document.getElementById('inputText').value,
        valRadio = `${form.querySelector('input[name="gridRadios"]:checked').value} priority`,
        date = new Date(),
        hour = date.getHours(),
        year = date.getFullYear(),
        minute, day, month;

    date.getMinutes() < 10 ? minute = `0${date.getMinutes()}` : minute = date.getMinutes();
    date.getDate() < 10 ? day = `0${date.getDate()}` : day = date.getDate();
    date.getMonth() < 9 ? month = `0${date.getMonth() + 1}` : month = date.getMonth() + 1;
    
    let valTime = `${hour}:${minute} ${day}.${month}.${year}`;

    currentTasks.insertAdjacentHTML('afterbegin', task(valTitle, valRadio, valTime, valText));

    btnModalHide[0].click();
    form.reset();

    handleBtnsCollection(btnsComplete, taskToCompleted);
    handleBtnsCollection(btnsDelete, deleteTask);
    handleBtnsCollection(btnsEdit, editTask);
  });


  // sort tasks
  let allCurrentTasks = currentTasks.children,
      enumerator = [],
      timeStamp,
      taskDate,
      taskTime,
      switching = true,
      shouldSwitch,
      i;

  const enumerate = () => {
          for (i = 0; i < allCurrentTasks.length; i++) {
            timeStamp = allCurrentTasks[i].querySelectorAll('small')[1]
                                          .innerHTML
                                          .split(' ');
            taskDate = timeStamp[1].split('.')
                                    .reverse()
                                    .join('-');
            taskTime = timeStamp[0];
        
            enumerator.push(Date.parse(`${taskDate}T${taskTime}`));
          };
        },

        switchingDown = () => {
          for (i = 0; i < (enumerator.length - 1); i++) {
            shouldSwitch = false;

            if (enumerator[i] < enumerator[i + 1]) {
              shouldSwitch = true;
              break;
            };
          };
        },

        switchingUp = () => {
          for (i = 0; i < (enumerator.length - 1); i++) {
            shouldSwitch = false;

            if (enumerator[i] > enumerator[i + 1]) {
              shouldSwitch = true;
              break;
            };
          };
        },

        letSortTasks = (switchDirection) => {
          enumerate();

          while (switching) {
            switching = false;

            switchDirection();

            if (shouldSwitch) {
              let temp = enumerator[i];
              enumerator[i] = enumerator[i + 1];
              enumerator[i + 1] = temp;
        
              allCurrentTasks[i].before(allCurrentTasks[i + 1]);
              switching = true;
            };
          };
        };

  btnSortDown.addEventListener('click', () => letSortTasks(switchingDown));
  btnSortUp.addEventListener('click', () => letSortTasks(switchingUp));


  // filter by priority
  const btnFilterByLow = document.getElementById('filterLow'),
        btnFilterByMedium = document.getElementById('filterMedium'),
        btnFilterByHigh = document.getElementById('filterHigh'),
        btnFilterByAll = document.getElementById('filterAll'),

        letFilterBy = (byWhat) => {
          for (item of allCurrentTasks) {
            let priorityVal = item.querySelector('small')
                                  .innerHTML
                                  .split(' ')[0]
                                  .toString();

            if (item.classList.contains('d-none') || byWhat == priorityInstanceAll) {
              item.classList.remove('d-none');
              item.classList.add('d-flex');
            };
            
            if (priorityVal !== byWhat && byWhat !== priorityInstanceAll) {
              item.classList.remove('d-flex');
              item.classList.add('d-none');
            };
          };
        };

  btnFilterByLow.addEventListener('click', () => letFilterBy(priorityInstanceLow));
  btnFilterByMedium.addEventListener('click', () => letFilterBy(priorityInstanceMedium));
  btnFilterByHigh.addEventListener('click', () => letFilterBy(priorityInstanceHigh));
  btnFilterByAll.addEventListener('click', () => letFilterBy(priorityInstanceAll));
});