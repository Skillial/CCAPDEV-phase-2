const editError = document.getElementById('profileEdit_error');
const currentPfpLink = document.getElementById('currentPfpLink').value;
document.getElementById('profile-form').addEventListener('submit', async function (event) {
    event.preventDefault(); // Prevent the default form submission behavior

    // Get the form data
    const formData = new FormData(event.target);

    // Check if a file has been selected
    const fileInput = document.querySelector("input[name='photo']");
    if (fileInput.files.length === 0) {
        // If no file is selected, proceed with form submission without uploading an image
        await submitForm(formData, null); // Pass null as the canvas data
    } else {
        // If a file is selected, get the canvas data and upload the image first
        const canvasData = canvas.cropper('getCroppedCanvas').toDataURL("image/png"); // Get the canvas data as data URL
        await uploadImage(formData, canvasData);
    }
});
        
async function uploadImage(formData, canvasData) {
    editError.textContent = "Loading... this may take a little while.";
    console.log(canvasData);
    if (!canvasData || typeof canvasData !== 'string' || !canvasData.startsWith('data:image/')) {
        // If canvasData is not a valid data URI, there's no image to upload, so proceed with form submission without uploading an image
        submitForm(formData, null); // Pass defaultImageURL as the image link
        return;
    }
    

    let url = "https://script.google.com/macros/s/AKfycbzHrW44F8-PC41XVJyvuyf9dcVVWDjUcSQPpUdCPfZIh6meEEINS7WAAG5vV2PoShvi/exec";
    let file = dataURItoBlob(canvasData);
    // let file = document.getElementById("fileInput");
    let fr = new FileReader();
    fr.addEventListener('loadend', () => {
        let res = fr.result;
        let spt = res.split("base64,")[1];
        let obj = {
            base64: spt,
            type: file.type,
            name: file.name
        }
        fetch(url, {
            method: "POST",
            body: JSON.stringify(obj)
        })
        .then(r => r.text())
        .then(link => {
            console.log("Image link:", link);
            editError.textContent = "Almost done... You will be redirected shortly!";
            // Pass the image link to the submitForm function
            submitForm(formData, link);
        })
        .catch(error => console.error("Error:", error));
    });
    fr.readAsDataURL(file);
}
        

function dataURItoBlob(dataURI) {
    // Convert base64 to raw binary data held in a string
    const byteString = atob(dataURI.split(',')[1]);
    // Separate the mime component
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    // Write the bytes of the string to an ArrayBuffer
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const uint8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
        uint8Array[i] = byteString.charCodeAt(i);
    }
    // Create a Blob with the data and set the name property
    const blob = new Blob([arrayBuffer], { type: mimeString });
    blob.name = "profile_image.png"; // Set the name of the blob (you can change "profile_image.png" to a desired name)
    return blob;
}

// Function to handle form submission
async function submitForm(formData, imageLink) {
    // Get the default image URL (old image URL) from the formData
    //const defaultImageURL = formData.get("photo");
    // If imageLink is null, the user didn't select a new image, so keep the old one (defaultImageURL)
    if (!imageLink) {
        console.log(currentPfpLink);
        imageLink = currentPfpLink;
    }

    // Add the image link to the formData
    formData.append("photo", imageLink);

    try {
        // Send the PATCH request using fetch
        //fetch(`/api/user/${encodeURIComponent('<%= user.username %>')}`, {
        console.log([...formData]);
        const response = await fetch(`/editprofile`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(Object.fromEntries(formData)),
            credentials: 'include'
        });

        if (response.ok) {
            window.location.href = '/profile';
        } else {
            const errorMessage = await response.json();
            editError.textContent = errorMessage.error;
            console.error('Failed to update profile. Please try again later.');
        }
    } catch (error) {
        console.error(error);
        // Handle error (if needed)
    }
}


        var canvas  = $("#canvas"),
            context = canvas.get(0).getContext("2d"),
            $result = $('#result');

        $('#fileInput').on('change', function () {
            if (this.files && this.files[0]) {
                if (this.files[0].type.match(/^image\//)) {
                    var reader = new FileReader();
                    reader.onload = function (evt) {
                        var img = new Image();
                        img.onload = function () {
                            context.canvas.height = img.height;
                            context.canvas.width = img.width;
                            context.drawImage(img, 0, 0);
                            var cropper = canvas.cropper({
                                aspectRatio: 1 / 1,
                                viewMode: 2,
                                background: false 
                            });
                            $('#canvas-container').show(); // Show the canvas container
                        };
                        img.src = evt.target.result;
                    };
                    reader.readAsDataURL(this.files[0]);
                } else {
                    alert("Invalid file type! Please select an image file.");
                }
            } else {
                $('#canvas-container').hide(); // Hide the canvas container
                alert('No file(s) selected.');
            }
        });