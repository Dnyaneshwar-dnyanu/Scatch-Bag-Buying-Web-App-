
function main () {

     // Adding Preview while creating products

     // Input elements
     let imageInput = document.getElementById('imageInput');
     let nameInput = document.getElementById('nameInput');
     let priceInput = document.getElementById('priceInput');
     let bgcolorInput = document.getElementById('bgcolorInput');
     let panelcolorInput = document.getElementById('panelcolorInput');
     let textcolorInput = document.getElementById('textcolorInput');

     // Preview elements
     let previewBGColor = document.getElementById('previewBGColor');
     let previewImage = document.getElementById('previewImage');
     let previewPanelColor = document.getElementById('previewPanelColor');
     let previewTextColor = document.getElementById('previewTextColor');
     let previewName = document.getElementById('previewName');
     let previewPrice = document.getElementById('previewPrice');

     nameInput.addEventListener('input', () => {
          previewName.textContent = nameInput.value;
     });
     priceInput.addEventListener('input', () => {
          previewPrice.textContent = '₹' + priceInput.value;
     });
     bgcolorInput.addEventListener('input', () => {
          previewBGColor.style.backgroundColor = bgcolorInput.value;
     });
     panelcolorInput.addEventListener('input', (e) => {
          previewPanelColor.style.backgroundColor = panelcolorInput.value;
     });
     textcolorInput.addEventListener('input', () => {
          previewTextColor.style.color = textcolorInput.value;
     });
     imageInput.addEventListener('change', (event) => {
          const file = event.target.files[0];

          if (file) {
               const reader = new FileReader();
               reader.onload = (e) => {
                    previewImage.classList.remove('invisible');
                    previewImage.src = e.target.result;
               };

               reader.readAsDataURL(file);
          }
     });


     document.querySelector('.dropdown').addEventListener('click', (e) => {
          console.log('clicked');
          document.querySelector('.dropdown-content').classList.toggle('hidden');
     });

}

main()