document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.action-btn');
  
    buttons.forEach((btn, index) => {
      btn.addEventListener('click', () => {
        alert(`You clicked on Card ${index + 1}`);
        btn.textContent = "Clicked!";
        btn.classList.remove('btn-primary');
        btn.classList.add('btn-success');
      });
    });
  });
  