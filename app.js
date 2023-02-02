const employee_list = document.querySelector('#employee_list ul:last-child');
const form = document.querySelector('form:last-child');
const btn_add = form.querySelector('.btn_add');
const btn_edit = form.querySelector('.btn_edit');
const name = form.querySelector('#name');
const id_number = form.querySelector('#id_number');
const word_unit = form.querySelector('#word_unit');
const time_joining = form.querySelector('#time_joining');
const type_of_employee = form.querySelector('#type_of_employee');

btn_add.querySelector('button:first-child').addEventListener('click', () => {
    let {
        name_value,
        id_number_value,
        word_unit_value,
        time_joining_value,
        type_of_employee_value,
    } = getValueInput();

    addEmployeeElement(
        name_value,
        id_number_value,
        word_unit_value,
        time_joining_value,
        type_of_employee_value,
    );
    saveEmployeeList();
    resetInput();
});

function addEmployeeElement(
    name_value,
    id_number_value,
    word_unit_value,
    time_joining_value,
    type_of_employee_value,
    index,
) {
    let employeeList = getEmployeeInLocal();
    let li = createElementLi(
        name_value,
        id_number_value,
        word_unit_value,
        time_joining_value,
        type_of_employee_value,
    );

    li.querySelector('.btnEdit').addEventListener('click', () => {
        resetButton('edit');
        btn_edit
            .querySelector('button:first-child')
            .setAttribute(
                'onclick',
                `editEmployee(${index !== undefined ? index : employeeList.length})`,
            );
        btn_edit.querySelector('button:last-child').addEventListener('click', () => {
            resetInput();
            resetButton();
        });

        resetInput(
            name_value,
            id_number_value,
            word_unit_value,
            time_joining_value,
            type_of_employee_value,
        );
    });
}

function createElementLi(
    name_value,
    id_number_value,
    word_unit_value,
    time_joining_value,
    type_of_employee_value,
) {
    let li = document.createElement('li');
    li.innerHTML = `
        <span class="name">${name_value}</span> 
        <span class="id_number">${id_number_value}</span> 
        <span class="word_unit">${word_unit_value}</span> 
        <span class="time_joining">${time_joining_value}</span>
        <span class="type_of_employee"></span>
        <span>
            <button class="btnEdit btn-outline-primary btn">Edit</button>
            <button class="btnRemove btn-outline-danger btn">Remove</button>
        </span>
    `;

    li.querySelector('.btnRemove').addEventListener('click', () => {
        employee_list.removeChild(li);
        // resetButton();
        // resetInput();
        saveEmployeeList();
    });

    setTypeOfEmpoyee(li, type_of_employee_value);
    employee_list.appendChild(li);
    return li;
}

function setTypeOfEmpoyee(li, type_of_employee) {
    let type_of_employee_span = li.querySelector('.type_of_employee');

    if (type_of_employee === 'thoi_vu') {
        type_of_employee_span.classList.add('thoi_vu');
        type_of_employee_span.innerText = 'Thời vụ';
    } else {
        type_of_employee_span.classList.add('bien_che');
        type_of_employee_span.innerText = 'Biên chế';
    }
}

function saveEmployeeList() {
    let employeeList = employee_list.querySelectorAll('li');
    let employeeArr = [];
    employeeList.forEach((item, index) => {
        employeeArr.push({
            index: index,
            name: item.querySelector('.name').textContent,
            id_number: item.querySelector('.id_number').textContent,
            word_unit: item.querySelector('.word_unit').textContent,
            time_joining: item.querySelector('.time_joining').textContent,
            type_of_employee: item.querySelector('.type_of_employee').classList[1],
        });
    });
    localStorage.setItem('employee_list', JSON.stringify(employeeArr));
}

function editEmployee(index) {
    const employeeList = getEmployeeInLocal();
    let {
        name_value,
        id_number_value,
        word_unit_value,
        time_joining_value,
        type_of_employee_value,
    } = getValueInput();
    employeeList.splice(index, 1, {
        id_number: id_number_value,
        index,
        name: name_value,
        time_joining: time_joining_value,
        type_of_employee: type_of_employee_value,
        word_unit: word_unit_value,
    });
    localStorage.setItem('employee_list', JSON.stringify(employeeList));
    resetButton();
    resetInput();
    showEmployeeList();
}

function resetInput(
    name_ = '',
    id_number_ = '',
    word_unit_ = '',
    time_joining_ = '',
    type_of_employee_ = '',
) {
    name.value = name_;
    id_number.value = id_number_;
    word_unit.value = word_unit_;
    time_joining.value = time_joining_;
    type_of_employee.options[0].selected = true;
    for (let i = 0; i < type_of_employee.options.length; i++) {
        if (type_of_employee.options[i].value === type_of_employee_) {
            type_of_employee.options[i].selected = true;
        }
    }
}

function resetButton(arg) {
    if (arg === 'edit') {
        btn_add.setAttribute('hidden', true);
        btn_edit.removeAttribute('hidden');
    } else {
        btn_add.removeAttribute('hidden');
        btn_edit.setAttribute('hidden', true);
    }
}

function showEmployeeList() {
    employee_list.innerHTML = '';
    let employeeList = JSON.parse(localStorage.getItem('employee_list'));
    employeeList.forEach((item) => {
        addEmployeeElement(
            item.name,
            item.id_number,
            item.word_unit,
            item.time_joining,
            item.type_of_employee,
            item.index,
        );
    });
}

function getEmployeeInLocal() {
    let employeeList = JSON.parse(localStorage.getItem('employee_list'));
    return employeeList;
}

function getValueInput() {
    let name_value = name.value.trim();
    let id_number_value = id_number.value.trim();
    let word_unit_value = word_unit.value.trim();
    let time_joining_value = time_joining.value;
    let type_of_employee_value;
    for (let i = 0; i < type_of_employee.options.length; i++) {
        if (type_of_employee.options[i].selected === true) {
            type_of_employee_value = type_of_employee.options[i].value;
        }
    }

    return {
        name_value,
        id_number_value,
        word_unit_value,
        time_joining_value,
        type_of_employee_value,
    };
}

// ------------SEARCH----------------

const nameSearch = document.querySelector('#name_search');
const timeSearchFrom = document.querySelector('#time_search_from');
const timeSearchTo = document.querySelector('#time_search_to');
const idNumberSearch = document.querySelector('#id_number_search');

function handleSearch() {
    let searchResult = [...getEmployeeInLocal()];
    //filter by name
    if (nameSearch.value) {
        searchResult = searchResult.filter((item) =>
            removeAccents(item.name.toLowerCase()).includes(
                removeAccents(nameSearch.value.toLowerCase()),
            ),
        );
    }

    //filter by id number
    if (idNumberSearch.value) {
        searchResult = searchResult.filter((item) =>
            item.id_number.toLowerCase().includes(idNumberSearch.value.toLowerCase()),
        );
    }

    //filter by time_joining
    if (timeSearchFrom.value && timeSearchTo.value) {
        searchResult = searchResult.filter(
            (item) =>
                item.time_joining >= timeSearchFrom.value &&
                item.time_joining <= timeSearchTo.value,
        );
    } else if (timeSearchFrom.value || timeSearchTo.value) {
        if (timeSearchFrom.value) {
            searchResult = searchResult.filter((item) => item.time_joining >= timeSearchFrom.value);
        } else {
            searchResult = searchResult.filter((item) => item.time_joining <= timeSearchTo.value);
        }
    }

    employee_list.innerHTML = '';

    searchResult.forEach((item) => {
        addEmployeeElement(
            item.name,
            item.id_number,
            item.word_unit,
            item.time_joining,
            item.type_of_employee,
            item.index,
        );
    });
}

function clearSearch() {
    nameSearch.value = '';
    timeSearchFrom.value = '';
    timeSearchTo.value = '';
    idNumberSearch.value = '';
    showEmployeeList();
}

function removeAccents(str) {
    return str
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/Đ/g, 'D');
}

showEmployeeList();
