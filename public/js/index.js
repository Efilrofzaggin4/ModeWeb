const deleteCatButtons = document.querySelectorAll('.js-remove-cat-button');

// Parcourir les boutons de suppression et ajouter un gestionnaire d'événements clic
deleteCatButtons.forEach(button => {
  button.addEventListener('click', () => {
    const catId = button.getAttribute('data-id');
    // Appeler la fonction deleteCat avec l'ID de la Category
    deleteCat(catId);
  });
});

// Fonction deletePost pour envoyer une requête de suppression à votre backend
function deleteCat(catId) {
 //requête fetch 
  // en passant l'ID de la category
  // fetch :
  fetch(`/admin/category/${catId}`, {method: 'DELETE'})
    .then(response => {
      if (response.ok) {
        const deletedRow = document.querySelector(`div[data-id="${catId}"]`);
        if (deletedRow) {
          deletedRow.remove(); // Supprimer la ligne du tableau correspondant à l'actu supprimé
        }} else {
          throw new Error('Erreur lors de la suppression de l\'article');
        }
    })
    .catch(error => {
      console.error(error);
      //gestion d'erreur
    });
}