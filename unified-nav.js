const mergedTabs = new Set(["airhotel","transport","restaurants"]);

function unifyNavigation(){
  document.querySelectorAll("#tabs [data-tab]").forEach(button=>{
    const key=button.dataset.tab;
    if(mergedTabs.has(key))button.hidden=true;
    if(key==="timeline")button.textContent="전체 일정";
  });
}

const observer=new MutationObserver(()=>{clearTimeout(observer._t);observer._t=setTimeout(unifyNavigation,30);});
observer.observe(document.documentElement,{childList:true,subtree:true});
window.addEventListener("load",unifyNavigation);
