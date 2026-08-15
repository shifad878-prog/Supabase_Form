const supabaseUrl = "https://gvmyyjvbrmgmwgczqupm.supabase.co";
const supabaseKey = "sb_publishable_c3H02qaCKQ8DlLveDEvIHA_4H5_nKpE";

const { createClient } = supabase

const client = createClient(supabaseUrl, supabaseKey);

console.log(client);

let submitBtn = document.querySelector("#btn");
let studentName = document.querySelector("#name");
let studentCourse = document.querySelector("#course");
let studentEmail = document.querySelector("#email");

submitBtn && submitBtn.addEventListener("click", async (event) => {
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
                name: studentName.value,
                course: studentCourse.value,
                email: studentEmail.value,
            }])

        Swal.fire({
            title: "Added Successfully!",
            icon: "success",
            draggable: true
        });
        studentName.value = "";
        studentCourse.value = "";
        studentEmail.value = "";

    }
    catch (error) {
        console.log(error);
    }
});

// ye page jbh chly ga apki file all student.html wali hoge
if (window.location.pathname.endsWith ("/allstudent.html") ){
    const getAllStudents = async () => {
        try {
            //const {data, error } = await client.from("student-data").select().eq("name", "tayyaba"); for single row syntax
            const { data, error } = await client.from("student_data").select();

            let studentData = document.querySelector("#student");
            console.log(data);
            // data is array of object
            data.forEach((student) => {
                studentData.innerHTML += `  <div class="student-cards">
            <h1>${student.name}</h1> 
            <h2>${student.course}</h2> 
            <p>${student.email}</p>
            <button class="edit-btn" onclick ="update(${student.id})">Edit</button>
            <button class="edit-btn" onclick ="removeStudent(${student.id})">Delete</button>
            </div>  `

            });

            window.update = async (id) => {
                const { data } = await client
                    .from('student_data')
                    .select().eq("id", id);
                //read data in the form of array of object
                let { name, course, email } = data[0];
                console.log(name, course, email);
                const { value: formValues } = await Swal.fire({
                    title: "Edit Student Data",
                    html: `
              Name:  <input id="swal-input1" class="swal2-input" value="${name}">
              Course: <input id="swal-input2" class="swal2-input" value="${course}">
              Email: <input id="swal-input3" class="swal2-input" value="${email}">
                  `,
                    focusConfirm: false,
                    preConfirm: () => {
                        return [
                            document.getElementById("swal-input1").value,
                            document.getElementById("swal-input2").value,
                            document.getElementById("swal-input3").value,
                        ];
                    }
                });
                console.log(formValues);

                // updated data
                const updatedData = {
                    name: formValues[0],
                    course: formValues[1],
                    email: formValues[2],
                }

                const { error } = await client
                    .from('student_data')
                    .update(updatedData)
                    .eq('id', id)
                getAllStudents();
            };

            window.removeStudent = async (studentId) => {
                const response = await client
                    .from('student_data')
                    .delete()
                    .eq('id', studentId);
            }

        }
        catch (error) {
            console.log(error);
        }
    };
    getAllStudents();

    
}