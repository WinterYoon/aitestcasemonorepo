import cypressConfig from "../../cypress.config";

describe("로그인 시나리오 진행", () => {

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


  it("credits이 0인 유저는 payments 페이지로 이동해야 한다", () => {
    cy.visit("/payment", {
      onBeforeLoad(win) {
        win.Cypress = win.Cypress || {};
        win.Cypress.mockUser = {
          uid: "new_user_000",
          email: "newuser@examplet.com",
          credits: 0 // 최초 가입자
        }
      }
    });

    cy.url().should('include', '/payment');
    cy.contains('AS-IS')
    // 로그아웃 버튼 클릭
    cy.get('[data-cy=payment-logout]').click();

    // 로그인 페이지로 리디렉션 되었는지 확인
    cy.url().should('include', '/'); // 또는 '/'
    cy.contains('AI가 10초 만에 테스트 케이스를 자동으로 만들어줘요!'); // 페이지에 '로그인'이라는 텍스트가 있는지 확인
  });

it("credits이 있는 유저는 dashboard 페이지로 이동해야 한다", () => {
  cy.visit('/dashboard', {
    onBeforLoad(win) {
      win.Cypress = win.Cypress || {};
      win.Cypress.mockUser = {
        uid: "existing_user_123",
        email: "user@examplet.com",
        credits: 5, // 기존 가입자
      }
    }
  });

  cy.url().should('include', '/dashboard');
  cy.contains('마이페이지')

  cy.get('[data-cy=dashboard-logout]').click();

  // 로그인 페이지로 리디렉션 되었는지 확인
  cy.url().should('include', '/'); // 또는 '/'
  cy.contains('AI가 10초 만에 테스트 케이스를 자동으로 만들어줘요!'); // 페이지에 '로그인'이라는 텍스트가 있는지 확인
})
});