
    function limitCheckboxes(containerId, max, counterId, otherCbId, otherInputId){
      const container = document.getElementById(containerId);
      const checkboxes = container.querySelectorAll('input[type="checkbox"]');
      const counter = document.getElementById(counterId);
      function refresh(){
        const checked = Array.from(checkboxes).filter(c=>c.checked);
        counter.textContent = checked.length;
        checkboxes.forEach(cb=>{
          if(!cb.checked && checked.length >= max) cb.disabled = true;
          else cb.disabled = false;
        });
      }
      checkboxes.forEach(cb=>{
        cb.addEventListener('change', refresh);
      });
      refresh();

      // fonction optionnel
      if(otherCbId && otherInputId){
        const otherCb = document.getElementById(otherCbId);
        const otherInput = document.getElementById(otherInputId);
        if(otherCb && otherInput){
          otherCb.addEventListener('change', ()=> {
            otherInput.style.display = otherCb.checked ? 'inline-block' : 'none';
            if(!otherCb.checked) otherInput.value = '';
          });
        }
      }
    }


    limitCheckboxes('q2', 3, 'c2', 'q2-autre-cb', 'q2-autre');
    limitCheckboxes('q5', 2, 'c5', 'q5-autre-cb', 'q5-autre');
    limitCheckboxes('q7', 2, 'c7');
    limitCheckboxes('q10', 2, 'c10');

    
    document.querySelectorAll('input[name="q3"]').forEach(r=>{
      r.addEventListener('change', ()=>{
        const otherInput = document.getElementById('q3-autre');
        if(r.value === 'Autre' && r.checked) otherInput.style.display = 'inline-block';
        else if(r.checked) otherInput.style.display = 'none';
      });
    });

    
    const form = document.getElementById('survey');
    const feedback = document.getElementById('feedback');
    const resetBtn = document.getElementById('reset');

    function collectCheckboxValues(name){
      return Array.from(document.querySelectorAll('input[name="'+name+'"]:checked')).map(i=>i.value);
    }

    form.addEventListener('submit', function(e){
      e.preventDefault();

      
      const data = {};
      data.q1 = form.q1.value || '';
      
      const q2vals = collectCheckboxValues('q2');
      const q2aut = document.getElementById('q2-autre')?.value?.trim();
      if(q2aut && q2vals.includes('Autre')) q2vals[q2vals.indexOf('Autre')] = 'Autre: ' + q2aut;
      data.q2 = q2vals;

      
      let q3 = form.q3.value || '';
      if(q3 === 'Autre'){
        const q3aut = document.getElementById('q3-autre')?.value?.trim();
        q3 = q3aut ? 'Autre: ' + q3aut : 'Autre';
      }
      data.q3 = q3;

      data.q4 = form.q4.value || '';
      
      const q5vals = collectCheckboxValues('q5');
      const q5aut = document.getElementById('q5-autre')?.value?.trim();
      if(q5aut && q5vals.includes('Autre')) q5vals[q5vals.indexOf('Autre')] = 'Autre: ' + q5aut;
      data.q5 = q5vals;

      data.q6 = form.q6.value || '';
      const q7vals = collectCheckboxValues('q7');
      data.q7 = q7vals;
      data.q8 = form.q8.value || '';
      data.q9 = form.q9.value || '';
      const q10vals = collectCheckboxValues('q10');
      data.q10 = q10vals;

      
      let html = '<strong>Merci — voici un récapitulatif rapide :</strong><ul style="margin:10px 0 0 18px">';
      html += '<li><strong>Fréquence d\'utilisation :</strong> ' + escapeHtml(data.q1) + '</li>';
      html += '<li><strong>Objectifs :</strong> ' + (data.q2.length ? escapeHtml(data.q2.join(', ')) : '—') + '</li>';
      html += '<li><strong>Sites visités :</strong> ' + escapeHtml(data.q3) + '</li>';
      html += '<li><strong>Temps moyen / jour :</strong> ' + escapeHtml(data.q4) + '</li>';
      html += '<li><strong>Appareils :</strong> ' + (data.q5.length ? escapeHtml(data.q5.join(', ')) : '—') + '</li>';
      html += '<li><strong>Achat en ligne :</strong> ' + escapeHtml(data.q6) + '</li>';
      html += '<li><strong>Moyens de paiement :</strong> ' + (data.q7.length ? escapeHtml(data.q7.join(', ')) : '—') + '</li>';
      html += '<li><strong>Problèmes de sécurité rencontrés :</strong> ' + escapeHtml(data.q8) + '</li>';
      html += '<li><strong>Niveau informatique :</strong> ' + escapeHtml(data.q9) + '</li>';
      html += '<li><strong>Obstacles :</strong> ' + (data.q10.length ? escapeHtml(data.q10.join(', ')) : '—') + '</li>';
      html += '</ul>';
      html += '<p class="small" style="margin-top:8px;color:var(--muted)">Toutes les données restent sur ton appareil — rien n\'est envoyé.</p>';

      feedback.innerHTML = html;
      feedback.style.display = 'block';

    
    });

    resetBtn.addEventListener('click', ()=>{
      form.reset();
    
      ['q2-autre','q3-autre','q5-autre'].forEach(id=>{
        const el = document.getElementById(id);
        if(el) el.style.display = 'none';
      });
      // rafraichir le contenu
      ['c2','c5','c7','c10'].forEach(id=>{
        const el = document.getElementById(id);
        if(el) el.textContent = '0';
      });
      feedback.style.display = 'none';
    });

    
    function escapeHtml(text){
      if(!text) return '';
      return String(text)
        .replaceAll('&','&amp;')
        .replaceAll('<','&lt;')
        .replaceAll('>','&gt;')
        .replaceAll('"','&quot;')
        .replaceAll("'",'&#039;');
    }

    window.addEventListener('load', ()=> {
      const firstReq = document.querySelector('input[required]');
      if(firstReq) firstReq.focus();
    });
  