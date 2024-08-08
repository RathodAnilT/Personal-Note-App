const addBtn = document.getElementById('add');

const notes = JSON.parse(localStorage.getItem('notes'));

if (notes) {
    notes.forEach(note => addNewNote(note));
}

addBtn.addEventListener('click', () => addNewNote());

function addNewNote(text = '') {
    const note = document.createElement('div');
    note.classList.add('note');

    note.innerHTML = `
    <div class="tools">
        <button class="edit"><i class="fas fa-edit"></i></button>
        <button class="delete"><i class="fas fa-trash-alt"></i></button>
    </div>

    <div class="toolbar">
        <button class="bold"><b>B</b></button>
        <button class="italic"><i>I</i></button>
        <button class="underline"><u>U</u></button>
        <button class="strikethrough"><s>S</s></button>
        <button class="align-left">Left</button>
        <button class="align-center">Center</button>
        <button class="align-right">Right</button>
        <select class="font-size">
            <option value="16px">16px</option>
            <option value="18px">18px</option>
            <option value="20px">20px</option>
            <option value="24px">24px</option>
        </select>
        <select class="font-family">
            <option value="Arial">Arial</option>
            <option value="Courier New">Courier New</option>
            <option value="Georgia">Georgia</option>
            <option value="Times New Roman">Times New Roman</option>
            <option value="Poppins">Poppins</option>
        </select>
        <input type="color" class="text-color" title="Text Color">
        <input type="color" class="bg-color" title="Background Color">
        <button class="indent-increase">Indent</button>
        <button class="indent-decrease">Outdent</button>
    </div>

    <div class="content">
        <div class="main ${text ? "" : "hidden"}"></div>
        <textarea class="${text ? "hidden" : ""}">${text}</textarea>
    </div>
    `;

    const editBtn = note.querySelector('.edit');
    const deleteBtn = note.querySelector('.delete');
    const main = note.querySelector('.main');
    const textArea = note.querySelector('textarea');
    const boldBtn = note.querySelector('.bold');
    const italicBtn = note.querySelector('.italic');
    const underlineBtn = note.querySelector('.underline');
    const strikethroughBtn = note.querySelector('.strikethrough');
    const alignLeftBtn = note.querySelector('.align-left');
    const alignCenterBtn = note.querySelector('.align-center');
    const alignRightBtn = note.querySelector('.align-right');
    const fontSizeSelect = note.querySelector('.font-size');
    const fontFamilySelect = note.querySelector('.font-family');
    const textColorInput = note.querySelector('.text-color');
    const bgColorInput = note.querySelector('.bg-color');
    const indentIncreaseBtn = note.querySelector('.indent-increase');
    const indentDecreaseBtn = note.querySelector('.indent-decrease');

    textArea.value = text;
    main.innerHTML = marked(text);

    deleteBtn.addEventListener('click', () => {
        note.remove();
        updateLS();
    });

    editBtn.addEventListener('click', () => {
        main.classList.toggle('hidden');
        textArea.classList.toggle('hidden');
    });

    textArea.addEventListener('input', (e) => {
        const { value } = e.target;
        main.innerHTML = marked(value);
        updateLS();
    });

    // Toolbar button event listeners
    boldBtn.addEventListener('click', () => formatText('bold'));
    italicBtn.addEventListener('click', () => formatText('italic'));
    underlineBtn.addEventListener('click', () => formatText('underline'));
    strikethroughBtn.addEventListener('click', () => formatText('strikethrough'));
    alignLeftBtn.addEventListener('click', () => formatText('align', 'left'));
    alignCenterBtn.addEventListener('click', () => formatText('align', 'center'));
    alignRightBtn.addEventListener('click', () => formatText('align', 'right'));
    fontSizeSelect.addEventListener('change', (e) => formatText('font-size', e.target.value));
    fontFamilySelect.addEventListener('change', (e) => formatText('font-family', e.target.value));
    textColorInput.addEventListener('input', (e) => formatText('text-color', e.target.value));
    bgColorInput.addEventListener('input', (e) => formatText('bg-color', e.target.value));
    indentIncreaseBtn.addEventListener('click', () => formatText('indent', 'increase'));
    indentDecreaseBtn.addEventListener('click', () => formatText('indent', 'decrease'));

    document.body.appendChild(note);
}

function formatText(style, value) {
    const textarea = document.querySelector('textarea:not(.hidden)');
    const { selectionStart, selectionEnd, value: currentValue } = textarea;
    const selectedText = currentValue.substring(selectionStart, selectionEnd);
    
    let formattedText = selectedText;
    switch (style) {
        case 'bold':
            formattedText = `**${selectedText}**`;
            break;
        case 'italic':
            formattedText = `*${selectedText}*`;
            break;
        case 'underline':
            formattedText = `<u>${selectedText}</u>`;
            break;
        case 'strikethrough':
            formattedText = `~~${selectedText}~~`;
            break;
        case 'align':
            formattedText = `<div style="text-align: ${value};">${selectedText}</div>`;
            break;
        case 'font-size':
            formattedText = `<span style="font-size: ${value};">${selectedText}</span>`;
            break;
        case 'font-family':
            formattedText = `<span style="font-family: ${value};">${selectedText}</span>`;
            break;
        case 'text-color':
            formattedText = `<span style="color: ${value};">${selectedText}</span>`;
            break;
        case 'bg-color':
            formattedText = `<span style="background-color: ${value};">${selectedText}</span>`;
            break;
        case 'indent':
            const indent = value === 'increase' ? 'padding-left: 2em;' : 'padding-left: 0;';
            formattedText = `<div style="${indent}">${selectedText}</div>`;
            break;
    }
    
    textarea.value = currentValue.substring(0, selectionStart) + formattedText + currentValue.substring(selectionEnd);
    textarea.dispatchEvent(new Event('input'));
}

function updateLS() {
    const notesText = document.querySelectorAll('textarea');

    const notes = [];

    notesText.forEach(note => notes.push(note.value));

    localStorage.setItem('notes', JSON.stringify(notes));
}
