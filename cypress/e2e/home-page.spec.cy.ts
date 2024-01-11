describe("template spec", () => {
  it("Render default home page on screen", () => {
    cy.visit("http://localhost:3000/");
    cy.get('[data-testid="app-1"]').should("exist");
  });

  it("Render any text", () => {
    cy.visit("http://localhost:3000/");
    cy.get('[data-testid="text-test"]')
      .should("exist")
      .should("have.text", "data");
  });
});
