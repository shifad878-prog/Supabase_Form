const supabaseUrl = "https://gvmyyjvbrmgmwgczqupm.supabase.co";
const supabaseKey = "sb_publishable_c3H02qaCKQ8DlLveDEvIHA_4H5_nKpE";

const { createClient } = supabase

const client = createClient(supabaseUrl, supabaseKey);

console.log(client);

let submitBtn = document.querySelector("#btn");
let studentName = document.querySelector("#name");
let studentCourse = document.querySelector("#course");
let studentEmail = document.querySelector("#email");

submitBtn.addEventListener("click", async (event) => {
    try {
        event.preventDefault();

        if (!studentName.value || !studentCourse.value || !studentEmail.value) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Fill all data",
            });
            return;
        }
        const { error } = await client
            .from('student_data')
            .insert([{
                name : studentName.value,
                course : studentCourse.value,
                email : studentEmail.value,
            }])
            
        Swal.fire({
            title: "Added Successfully!",
            icon: "success",
            draggable: true
        });
    }
    catch(error){
        console.log(error);
    }
});

