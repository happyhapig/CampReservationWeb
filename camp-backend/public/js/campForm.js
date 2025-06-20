document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("campModal");
  const modal_backdrop = document.querySelector(".modal-backdrop");
  const form = document.getElementById("campForm");
  const modalTitle = document.getElementById("modalTitle");
  const cancelBtn = document.getElementById("cancelBtn");
  const closeBtn = document.getElementById("closeBtn");
  const campsiteList = document.getElementById("campsiteList");
  const addBtn = document.getElementById("add-campsite");
  const createPage = document.getElementById("openCreatePage");
  const topBar_createMode = document.getElementById("top_createMode");
  const topBar_editMode = document.getElementById("top_editMode");
  const createBtn = document.querySelector(".createBtn");
  const btnGroup = document.querySelector(".btnGroup");
  const previewPic = document.getElementById("preview_pic");
  const previewMap = document.getElementById("preview_map");
  const btn_previewPic = document.getElementById("btn_reviewPic");
  const btn_previewMap = document.getElementById("btn_reviewMap");
  const addReservationBtn = document.getElementById("add-reservation");
  const reservationGroun = document.querySelector(".reservationGroup");

  const showModal = () => {
    modal.classList.remove("hidden");
    modal_backdrop.classList.remove("hidden");
    document.body.style.overflow = "hidden";
  };

  const hideModal = () => {
    modal.classList.add("hidden");
    modal_backdrop.classList.add("hidden");
    form.reset();    
    campsiteList.innerHTML = '';
    document.body.style.overflow = "";
  };

  createPage.addEventListener("click", () => {
    showModal();
    
    topBar_createMode.classList.remove("hidden");
    topBar_editMode.classList.add("hidden");
    reservationGroun.classList.add("hidden");

    const updateBtn = document.querySelector(".updateBtn");
    if (updateBtn) updateBtn.classList.add("hidden");
    
    createBtn.classList.remove("hidden");

    calculateReservation(null);

    previewPic.src = '';
    previewMap.src = '';    
  });

  cancelBtn.addEventListener("click", () => {
    hideModal();
    window.location.href = "/camp";
  });

  closeBtn.addEventListener("click", () => {
    hideModal();
    window.location.href = "/camp";
  });

  let currentCampIndex = -1;

  function RefreshCampModal(index) {
    const camp = window.campList[index];
    if (!camp) return;

    currentCampIndex = index;
    modalTitle.innerText = `${camp.name}`;
    // 填入表單欄位
    document.querySelector('[name="_id"]').value = camp._id;
    document.querySelector('[name="id"]').value = camp.id;
    document.querySelector('[name="name"]').value = camp.name;
    document.querySelector('[name="area"]').value = camp.area;
    document.querySelector('[name="city"]').value = camp.city;
    document.querySelector('[name="county"]').value = camp.county;
    document.querySelector('[name="altitude"]').value = camp.altitude;
    document.querySelector('[name="type"]').value = camp.type;
    document.querySelector('[name="picture"]').value = camp.picture;
    document.querySelector('[name="campImg"]').value = camp.campImg;
    previewPic.src = camp.picture;
    previewMap.src = camp.campImg;

    // 清空並加入新的營位列表
    const campsiteList = document.getElementById("campsiteList");
    campsiteList.innerHTML = "";

    (camp.campsites || []).forEach((campsite, index) => {
      const row = document.createElement("div");
      row.className = "campsite-item";
      row.innerHTML = `
        <input type="text" name="campsites[${index}][id]" value="${campsite.id}" required />
        <input type="text" name="campsites[${index}][name]" value="${campsite.name}" required />
        <input type="number" name="campsites[${index}][amount]" value="${campsite.amount}" required />
        <input type="number" name="campsites[${index}][price]" value="${campsite.price}" required />
        <input type="text" name="campsites[${index}][picture]" value="${campsite.picture}" class="pic" required />
        <button type="button" class="btn-previewCampsite" data-index="${index}">預覽↗</button>
        <button type="button" class="removeCampsiteBtn">刪除</button>
      `;
      campsiteList.appendChild(row);
    });
    addReservationBtn.dataset.campId = camp.id;
    
    const form = document.querySelector("form");
    form.action = `/camp/update`;
  }

  document.querySelectorAll(".editBtn").forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      const id = btn.dataset.id;
      
      const index = window.campList.findIndex(c => c._id === id);
      if (index !== -1) RefreshCampModal(index);      
      
      createBtn.classList.add("hidden");
      reservationGroun.classList.remove("hidden");
      let updateBtn = document.querySelector(".updateBtn");
      if (updateBtn === null){
        updateBtn = document.createElement("button");
        updateBtn.type = "submit";
        updateBtn.className = "updateBtn";
        updateBtn.textContent = "儲存";
        btnGroup.appendChild(updateBtn);      
      } else {
        updateBtn.classList.remove("hidden");
      }

      topBar_createMode.classList.add("hidden");
      topBar_editMode.classList.remove("hidden");
      showModal();
      
      const campData = window.campList.find(c => c._id === id);
      if (!campData) return alert("找不到營區資料");
      RefreshCampModal(campData);

      const campId = campData.id;      
      calculateReservation(campId);
    });
  });

  document.getElementById("btnPrev").addEventListener("click", () => {
    const prevIndex = (currentCampIndex - 1 + window.campList.length) % window.campList.length;
    RefreshCampModal(prevIndex);

    const camp = window.campList[prevIndex];    
    calculateReservation(camp.id);
    document.getElementById('campModal').scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });

  document.getElementById("btnNext").addEventListener("click", () => {
    const nextIndex = (currentCampIndex + 1) % window.campList.length;
    RefreshCampModal(nextIndex);
    const camp = window.campList[nextIndex];
    calculateReservation(camp.id);
    document.getElementById('campModal').scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
  
  function getNextCampsiteId() {
    const ids = Array.from(campsiteList.querySelectorAll('input[name*="[id]"]'))
      .map(input => input.value)
      .filter(id => /^\d+$/.test(id))
      .map(id => parseInt(id, 10));

    const maxId = ids.length ? Math.max(...ids) : 0;
    const nextId = maxId + 1;
    return nextId < 10 ? `0${nextId}` : `${nextId}`;
  }

  function addCampsiteRow() {
    const index = campsiteList.querySelectorAll(".campsite-item").length;
    const formattedId = getNextCampsiteId();
    const newItem = document.createElement("div");
    newItem.className = "campsite-item";
    newItem.innerHTML = `
      <input type="text" name="campsites[${index}][id]" value="${formattedId}" required />
      <input type="text" name="campsites[${index}][name]" required />
      <input type="number" name="campsites[${index}][amount]" required />
      <input type="number" name="campsites[${index}][price]" required />
      <input type="text" name="campsites[${index}][picture]" required class="pic" />
      <button type="button" class="btn-previewCampsite" data-index="${index}">預覽↗</button>
      <button type="button" class="removeCampsiteBtn">刪除</button>
    `;
    campsiteList.appendChild(newItem);
  }

  addBtn?.addEventListener("click", addCampsiteRow);

  campsiteList?.addEventListener("click", (e) => {
    if (e.target.classList.contains("removeCampsiteBtn")) {
      e.target.closest(".campsite-item").remove();
    }
  });

  addReservationBtn.addEventListener("click", async () => {
      
    if(!addReservationBtn.dataset.campId)
      addReservationBtn.dataset.campId = document.querySelector('[name="id"]').value;

    const campId = addReservationBtn.dataset.campId;
    const result = await fetch("/reservation/createAll", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ campId })
    });
    const data = await result.json();
    if (data.success) {
      alert("成功新增訂位資料");
      calculateReservation(campId);
    } else {
      alert("新增訂位資料失敗 : " + (data.error || "未知錯誤"));
    }
  });
  
  async function calculateReservation(campId) {
    
    let reservationData = [];

    if (campId) {
      try {
        const res = await fetch(`/reservation/reservations?campId=${campId}`);
        const data = await res.json();
        
        if (data.success) {
          reservationData = data.listReservation;           
        } else {
          alert("無法取得訂位資料");
        }
      } catch (err) {
        console.error("Fetch reservation error:", err);
        alert("載入訂位資料時發生錯誤");
      }
    }    

    const latestMonth = reservationData.reduce((latest, item) => {
      const [year, month] = item.date.split("-");
      const current = parseInt(year) * 12 + parseInt(month);
      return current > latest ? current : latest;
    }, 0);

    const year = Math.floor(latestMonth / 12);
    const month = latestMonth % 12 || 12;
    const latestOpenDate = `${year}-${String(month).padStart(2, "0")}`;

    const openDateElement = document.getElementById("textOpenDate");
    if (openDateElement) {
      const showText = reservationData.length > 0 ? `目前開放至：${latestOpenDate}` : "尚未開放訂位";
      openDateElement.innerHTML = showText;
    }

    const addReservationBtn = document.getElementById("add-reservation");

    addReservationBtn.innerHTML = reservationData.length > 0 ? "開放下個月訂位" : "開放當月訂位";
  }

  btn_previewPic.addEventListener("click", () => {
    const url = document.getElementById("picUrl");
    previewPic.src = url.value;
  });

  btn_previewMap.addEventListener("click", () => {
    const url = document.getElementById("mapUrl");
    previewMap.src = url.value;
  });

  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("btn-previewCampsite")) {
      
      const index = e.target.dataset.index;
      const input = document.querySelector(`input[name="campsites[${index}][picture]"]`);
      const url = input?.value?.trim();

      if (url && url.startsWith("http")) {
        window.open(url, "_blank");
      } else {
        alert("圖片網址無效");
      }
    }
  });

  document.getElementById("campForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    data.campsites = parseCampsiteForm(formData);

    const clickedBtn = document.activeElement;
    let actionUrl = "/camp";
    if (clickedBtn.classList.contains("updateBtn")) {
      actionUrl = "/camp/update";
    } 
    
    console.log(actionUrl);
    try {
      const res = await fetch(actionUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      
      if (result.success) {

        alert( actionUrl == "/camp" ? "新增資料成功！" : "修改資料成功！" );
        window.campList = result.allCamps;
        const campId = form.querySelector('input[name="_id"]').value;
        const index = window.campList.findIndex(c => c._id === campId);

        if(actionUrl == "/camp")
          window.location.href = "/camp";
          // reservationGroun.classList.remove("hidden");
        
        RefreshCampModal(index);

      } else {
        alert("修改失敗：" + result.message);
      }
    } catch (err) {
      alert("發送錯誤：" + err.message);
    }
  });

  function parseCampsiteForm(formData) {
    const campsites = [];

    for (const [key, value] of formData.entries()) {
      const match = key.match(/^campsites\[(\d+)]\[(\w+)]$/);
      if (match) {
        const index = Number(match[1]);
        const field = match[2];
        campsites[index] = campsites[index] || {};
        campsites[index][field] = value;
      }
    }

    return campsites;
  }
})
  



// document.addEventListener("DOMContentLoaded", () => {
//     const addBtn = document.getElementById("add-campsite");
//     const campsiteList = document.getElementById("campsiteList");

//     function getNextCampsiteId() {
//       const ids = Array.from(campsiteList.querySelectorAll('input[name*="[id]"]'))
//         .map(input => input.value)
//         .filter(id => /^\d+$/.test(id))
//         .map(id => parseInt(id, 10));
  
//       const maxId = ids.length ? Math.max(...ids) : 0;
//       const nextId = maxId + 1;
//       return nextId < 10 ? `0${nextId}` : `${nextId}`;
//     }
  
//     function addCampsiteRow() {
//       const index = campsiteList.querySelectorAll(".campsite-item").length;
//       const formattedId = getNextCampsiteId();
//       const newItem = document.createElement("div");
//       newItem.className = "campsite-item";
//       newItem.innerHTML = `
//         <input type="text" name="campsites[${index}][id]" value="${formattedId}" required />
//         <input type="text" name="campsites[${index}][name]" required />
//         <input type="number" name="campsites[${index}][amount]" required />
//         <input type="number" name="campsites[${index}][price]" required />
//         <input type="text" name="campsites[${index}][picture]" required class="pic" />
//         <button type="button" class="removeCampsiteBtn">刪除</button>
//       `;
//       campsiteList.appendChild(newItem);
//     }

//     addBtn?.addEventListener("click", addCampsiteRow);    
  
//     campsiteList?.addEventListener("click", (e) => {
//       if (e.target.classList.contains("removeCampsiteBtn")) {
//         e.target.closest(".campsite-item").parentElement.remove();
//       }
//     });

//     const reservationData = window.reservationData;
    
//     //取得所有訂位資料，比對最新的一筆
//     const latestMonth = reservationData.reduce((latest, item) => {
//       const [year, month] = item.date.split("-");
//       const current = parseInt(year) * 12 + parseInt(month);
//       return current > latest ? current : latest;
//     }, 0);
    
//     const year = Math.floor(latestMonth / 12);
//     const month = latestMonth % 12 || 12;
//     const latestOpenDate = `${year}-${String(month).padStart(2, "0")}`;

//     //顯示開放情況
//     const showText = reservationData.length > 0 ? `目前開放至：${latestOpenDate}` : "尚未開放訂位";
//     const openDateElement = document.getElementById("textOpenDate");
//     openDateElement.innerHTML = showText;

//     //顯示按鈕狀態
//     const addReservationBtn = document.getElementById("add-reservation");
//     addReservationBtn.innerHTML = reservationData.length > 0 ? "開放下個月訂位" : "開放當月訂位";

//     addReservationBtn.addEventListener("click", async () => {
//       const campId = addReservationBtn.dataset.campId;
//       const result = await fetch("/reservation/createAll", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ campId })
//       });

//       const data = await result.json();
//       if (data.success) {
//         alert(reservationData.length > 0 ? "成功開放下個月訂位" : "成功開放當月訂位");
//       } else {
//         alert("新增訂位資料失敗 : " + (data.error || "未知錯誤"));
//       }
//     });
//   });
// ;