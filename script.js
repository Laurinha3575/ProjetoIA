function updateRemoveButtons() {
    const removeButtons = document.querySelectorAll('.ingredient-row .btn-danger')
    if (document.querySelectorAll('.ingredient-row').length <= 2){
        removeButtons.forEach(button => button.disabled = true)
    } else {
        removeButtons.forEach(button => button.disabled = false)
    }
}

function addIngredient() {
    const ingredientsDiv = document.getElementById('ingredients')
    const ingredientRow = document.createElement('div') // Corrigido o erro de digitação
    ingredientRow.className = 'ingredient-row'

    const newInput = document.createElement('input') // Corrigido o erro de digitação
    newInput.type = 'text'
    newInput.className = 'ingredient form-control ingredient-input'
    newInput.placeholder = 'Informe o produto...'

    const removeButton = document.createElement('button')
    removeButton.className = 'btn-danger'
    removeButton.innerText = 'Excluir'
    removeButton.onclick = () => removeIngredient(removeButton)

    ingredientRow.appendChild(newInput)
    ingredientRow.appendChild(removeButton)
    ingredientsDiv.appendChild(ingredientRow)

    updateRemoveButtons()
}

function removeIngredient(button) {
    const ingredientRow = button.parentElement;
    ingredientRow.remove()
    updateRemoveButtons()
}

async function submitForm() {
    const ingredientInputs = document.getElementsByClassName('ingredient')
    const ingredientes = []
    for (let i = 0; i < ingredientInputs.length; i++) {
        if (ingredientInputs[i].value) {
            ingredientes.push(ingredientInputs[i].value)
        }
    }

    if (ingredientes.length < 3) {
        alert('Por favor, preencha pelo menos dois campos!')
        return
    }

    const data = {
        ingredientes: ingredientes
    }

    try {
        const response = await fetch('/receita', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })

        // Recebe a resposta como texto ao invés de JSON
        const result = await response.text()

        const responseDiv = document.getElementById('response')
        responseDiv.innerHTML = result
        responseDiv.style.display = 'block'
    } catch (error) {
        const responseDiv = document.getElementById('response')
        responseDiv.innerHTML = `<p>Erro: ${error.message}</p>`
        responseDiv.style.display = 'block'
    }
}

// Corrigido o erro de digitação
document.addEventListener('DOMContentLoaded', updateRemoveButtons)
