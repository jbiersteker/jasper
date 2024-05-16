document.addEventListener('DOMContentLoaded', function() {
    const codeElement = document.getElementById('code');

    const codeSnippet = `// Example Java code
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}`;

    let index = 0;

    function typeCode() {
        if (index < codeSnippet.length) {
            codeElement.textContent += codeSnippet[index];
            index++;
            Prism.highlightElement(codeElement); // Re-highlight the code after each addition
            setTimeout(typeCode, 20); // Adjust the typing speed here
        }
    }

    typeCode();
});
