class RiskScoreCalculator:
    def __init__(self, credit_score, loan_amount, property_value, annual_income, debt_amount, loan_type, property_type):
        self.credit_score = credit_score
        self.loan_amount = loan_amount
        self.property_value = property_value
        self.annual_income = annual_income
        self.debt_amount = debt_amount
        self.loan_type = loan_type
        self.property_type = property_type
    
    def calculate_ltv(self):
        return (self.loan_amount / self.property_value) * 100
    
    def get_ltv_risk_score(self):
        ltv = self.calculate_ltv()
        if ltv > 90:
            return 2
        elif ltv > 80:
            return 1
        else:
            return 0
    
    def calculate_dti(self):
        return (self.debt_amount / self.annual_income) * 100
    
    def get_dti_risk_score(self):
        dti = self.calculate_dti()
        if dti > 50:
            return 2
        elif dti > 40:
            return 1
        else:
            return 0
        
    def get_credit_score_risk_score(self):
        if self.credit_score < 650:
            return 1
        elif self.credit_score < 700:
            return 0
        else:
            return -1
    
    def get_property_type_risk_score(self):
        if self.property_type == "condo":
            return 1
        else:
            return 0
    
    def get_loan_type_risk_score(self):
        if self.loan_type == "adjustable":
            return 1
        elif self.loan_type == 'fixed':
            return -1
        
    def get_risk_score(self):
        ltv_risk = self.get_ltv_risk_score()
        dti_risk = self.get_dti_risk_score()
        credit_score_risk = self.get_credit_score_risk_score()
        property_type_risk = self.get_property_type_risk_score()
        loan_type_risk = self.get_loan_type_risk_score()
        
        total_risk = ltv_risk + dti_risk + credit_score_risk + property_type_risk + loan_type_risk

        return total_risk
