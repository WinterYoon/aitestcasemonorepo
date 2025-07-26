import cypressConfig from "../../cypress.config";

describe("메인페이지 접근", () => {
  it("메인페이지 로딩 확인", () => {
    cy.visit("/");
    cy.contains("Test Case AI");
  });

  it("구글 로그인 클릑 시 Google OAuth 페이지로 리디렉션 되는지 확인", () => {
    cy.visit("/");

    // 리디렉션 방식을 우회 테스트하기
    cy.window().then((win) => {
      cy.stub(win, "open").as("windowOpen");
    });
    cy.get("[data-cy=login-btn]").should("be.visible").click();

    // window.open이 호출되면서 Google 로그인 URL이 포함되어 있는지 확인
    cy.get("@windowOpen").should(
      "be.calledWithMatch",
      /firebaseapp\.com\/__\/auth\/handler/
    );
  });

});
