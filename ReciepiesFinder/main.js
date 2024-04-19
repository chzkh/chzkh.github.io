const input_texts = [
    // "abs"
    "Nestled among lush green hills, the serene village was a patchwork of small farms and quaint cottages. The villagers, known for their warm hospitality, gathered at the local market every morning, sharing stories and selling fresh produce.",
    "In today's fast-paced society, technology plays a crucial role. From smart homes that anticipate our needs to virtual reality systems that transport us to other worlds, the advancements in technology continue to reshape how we live, work, and communicate.",
    "Exploring the cosmos has always captivated human imagination. With the aid of powerful telescopes and ambitious space missions, scientists unravel the mysteries of distant galaxies, black holes, and the possibility of life beyond Earth.",
    "Culinary arts is not just about cooking; it's about creating experiences. Chefs combine flavors and textures to produce dishes that are as visually appealing as they are delicious, turning simple meals into moments of joy.",
    "Environmental conservation efforts are critical in preserving the natural world. Organizations and individuals alike are taking action to protect endangered species, restore habitats, and combat climate change, ensuring a sustainable future for all."
]

let current_pos = 0;
const in_seg = document.querySelector('.input_text');
let sel_text;
let cursorSpan;
let cursor_pos;
let mistakes;
let total_symb;
let timerInterval = null;
let timeElapsed = 0;

function start_timer() {
    if (timerInterval !== null) return;
    timerInterval = setInterval(() => {
        timeElapsed++;
    }, 10);
}

function stop_timer()
{
    if (timerInterval !== null)
    {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}

function check_correct()
{
    let parent = document.querySelector('.input_text');
    let wrongs = parent.querySelectorAll('.wrong');
    if (wrongs.length == 0)
        return true;
    return false;
}

function is_bottom(span) {
    const container = document.querySelector('.input_text');
    const span_rect = span.getBoundingClientRect();
    const container_rect = container.getBoundingClientRect();
    return (span_rect.bottom > container_rect.bottom - 20);
}

function count_acc()
{
    return mistakes === 0 ? 100 : 100 - total_symb / mistakes; 
}

function show_stats()
{
    document.querySelector('.input_window').style.display = 'none';
    document.querySelector('header').style.display = 'flex';
    document.removeEventListener("keydown", handleEvent);
    document.querySelector(".input_wrapper").style.background = "white";
    document.querySelector('.stats').style.display = 'flex';
    document.querySelector('.time_text').textContent = timeElapsed / 100;
    document.querySelector('.spm_text').textContent = (sel_text.length / (timeElapsed / 100)).toFixed(3) + " (symbols per second)";
    console.log("TOTAL: ", total_symb);
    document.querySelector('.accuracy_text').textContent = count_acc().toFixed(3) + "%";
}

function handleEvent(event)
{
    if (["Shift", "Alt", "Tab", "Control"].includes(event.key))
        return ;
    if (event.key == " ")
        event.preventDefault();
    if (event.key == "Backspace")
    {
        if (current_pos > 0)
            current_pos--;
        in_seg.children[current_pos].classList.remove('correct', 'wrong', 'cursor');
        if (current_pos < sel_text.length - 1)
            in_seg.children[current_pos + 1].classList.remove('cursor');
        else 
            in_seg.children[current_pos].classList.remove('cursor');
        in_seg.children[current_pos].classList.add('cursor');
    }
    else if (current_pos < sel_text.length)
    {
        in_seg.children[current_pos].classList.remove('cursor');
        if (event.key === sel_text[current_pos])
            in_seg.children[current_pos].className = 'correct';
        else 
        {
            in_seg.children[current_pos].className = 'wrong';
            mistakes++;
        }
        current_pos++;
        
        if (current_pos < in_seg.children.length) {
            in_seg.children[current_pos].classList.add('cursor');
        }
        if (current_pos >= sel_text.length)
            current_pos = sel_text.length;
        total_symb++;
    }

    if (current_pos < sel_text.length && is_bottom(in_seg.children[current_pos])) {
        const span_rect = in_seg.children[current_pos].getBoundingClientRect();
        const container_rect = in_seg.getBoundingClientRect();
        const scroll_amount = span_rect.bottom - container_rect.bottom + 20;
        in_seg.scrollTop += scroll_amount;
    }

    if (current_pos == sel_text.length)
    {
        if (check_correct())
        {
            stop_timer();
            show_stats();
        }
        else
            console.log("W");
    }
}

function init() {
    let random_idx = Math.floor(Math.random() * input_texts.length);
    sel_text = input_texts[random_idx];
    let input = document.querySelector('.input_text');
    
    cursor_pos = 0;

    for (let char of sel_text)
    {
        const span = document.createElement('span');
        span.innerHTML = char === ' ' ? '&nbsp;' : char;
        input.appendChild(span);
    }

    input.children[0].classList.add('cursor');

    current_pos = 0;
    mistakes = 0;
    total_symb = 0;

    document.addEventListener("keydown", handleEvent);
    start_timer();
}

function response_start()
{
    document.querySelector('.stats').style.display = 'none';
    document.querySelector(".input_window").style.display = "flex";
    document.querySelector(".input_wrapper").style.background = "black";
    document.querySelector('.input_text').innerHTML = null;
    timeElapsed = 0;
    init();
}

response_start();