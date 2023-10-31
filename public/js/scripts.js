function closeMenu() {
  const menu = document.getElementById('menu');
  const backdrop = document.getElementById('backdrop');
  const body = document.body;

  menu.classList.remove('show');
  backdrop.classList.remove('show');
  body.classList.remove('menu-open');
}

function toggleMenu() {
  const menu = document.getElementById('menu');
  const backdrop = document.getElementById('backdrop');
  const body = document.body;

  if (menu.classList.contains('show')) {
    menu.classList.remove('show');
    backdrop.classList.remove('show');
    body.classList.remove('menu-open');
  } else {
    menu.classList.add('show');
    backdrop.classList.add('show');
    body.classList.add('menu-open');
  }
}

document.getElementById('menu-toggle').addEventListener('click', toggleMenu);

// booking ID
function generateBookingID() {
  const letters = "BJD";
  const minNumber = 111111;
  const maxNumber = 999999;
  const randomNumber = Math.floor(Math.random() * (maxNumber - minNumber + 1)) + minNumber;
  const bookingID = letters + randomNumber.toString().padStart(6, '0');

  return bookingID;
}

const idGenInput = document.getElementById('idGen');
idGenInput.value = generateBookingID();