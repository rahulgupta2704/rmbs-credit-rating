from fastapi import APIRouter, Depends, HTTPException, status
from db import get_db
from sqlalchemy.orm import Session
from models.mortgage import Mortgage
from pydantic import BaseModel
from typing import Literal
import logging
from credit_rating import RiskScoreCalculator

router = APIRouter()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class CreateMortgage(BaseModel):
    credit_score: int
    loan_amount: float
    property_value: float
    annual_income: float
    debt_amount: float
    loan_type: Literal["fixed", "adjustable"]
    property_type: Literal["single_family", "condo"]

class MortgageResponse(BaseModel):
    id: int
    credit_score: int
    loan_amount: float
    property_value: float
    annual_income: float
    debt_amount: float
    loan_type: Literal["fixed", "adjustable"]
    property_type: Literal["single_family", "condo"]

    class Config:
        orm_mode = True
        from_attributes = True

@router.post("/mortgages/create")
def create_mortgage(mortgage: CreateMortgage, db: Session = Depends(get_db)):
    try:
        new_mortgage = Mortgage(
            credit_score=mortgage.credit_score,
            loan_amount=mortgage.loan_amount,
            property_value=mortgage.property_value,
            annual_income=mortgage.annual_income,
            debt_amount=mortgage.debt_amount,
            loan_type=mortgage.loan_type,
            property_type=mortgage.property_type
        )
        db.add(new_mortgage)
        db.commit()
        db.refresh(new_mortgage)
        return {"success": True, "message": "Mortgage added successfully", "payload": {"mortgage": new_mortgage}}
    except Exception as e:
        logger.error(f"Error creating mortgage: {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Error creating mortgage")

@router.get("/mortgages")
def get_mortgages(db: Session = Depends(get_db)):
    try:
        mortgages = db.query(Mortgage).all()
        return {"success": True, "payload": {"mortgages": mortgages}}
    except Exception as e:
        logger.error(f"Error fetching mortgages: {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Error fetching mortgages")

@router.get("/mortgages/{mortgage_id}")
def get_mortgage(mortgage_id: int, db: Session = Depends(get_db)):
    try:
        mortgage = db.query(Mortgage).filter(Mortgage.id == mortgage_id).first()
        if not mortgage:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Mortgage not found")
        return {"success": True, "payload": {"mortgage": mortgage}}
    except Exception as e:
        logger.error(f"Error fetching mortgage: {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Error fetching mortgage")

@router.delete("/mortgages/{mortgage_id}")
def delete_mortgage(mortgage_id: int, db: Session = Depends(get_db)):
    try:
        mortgage = db.query(Mortgage).filter(Mortgage.id == mortgage_id).first()
        if not mortgage:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Mortgage not found")
        db.delete(mortgage)
        db.commit()
        return {"success": True, "message": "Mortgage deleted successfully"}
    except Exception as e:
        logger.error(f"Error deleting mortgage: {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Error deleting mortgage")

@router.put("/mortgages/{mortgage_id}")
def edit_mortgage(mortgage_id: int, mortgage: CreateMortgage, db: Session = Depends(get_db)):
    try:
        existing_mortgage = db.query(Mortgage).filter(Mortgage.id == mortgage_id).first()
        if not existing_mortgage:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Mortgage not found")
        existing_mortgage.credit_score = mortgage.credit_score
        existing_mortgage.loan_amount = mortgage.loan_amount
        existing_mortgage.property_value = mortgage.property_value
        existing_mortgage.annual_income = mortgage.annual_income
        existing_mortgage.debt_amount = mortgage.debt_amount
        existing_mortgage.loan_type = mortgage.loan_type
        existing_mortgage.property_type = mortgage.property_type
        db.add(existing_mortgage)
        db.commit()
        db.refresh(existing_mortgage)
        return {
            "success": True,
            "message": "Mortgage updated successfully",
            "payload": {"mortgage": MortgageResponse.model_validate(existing_mortgage)}
        }
    except Exception as e:
        logger.error(f"Error updating mortgage: {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Error updating mortgage")

@router.post("/mortgages/final_credit_rating")
def get_final_credit_rating(mortgages: list[CreateMortgage]):
    try:
        total_risk_score = 0
        total_credit_score = 0
        
        for mortgage_data in mortgages:
            risk_calculator = RiskScoreCalculator(
                credit_score=mortgage_data.credit_score,
                loan_amount=mortgage_data.loan_amount,
                property_value=mortgage_data.property_value,
                annual_income=mortgage_data.annual_income,
                debt_amount=mortgage_data.debt_amount,
                loan_type=mortgage_data.loan_type,
                property_type=mortgage_data.property_type
            )
            risk_score = risk_calculator.get_risk_score()
            total_risk_score += risk_score
            total_credit_score += mortgage_data.credit_score

        avg_credit_score = total_credit_score / len(mortgages)
        if avg_credit_score >= 700:
            total_risk_score = total_risk_score - 1
        elif avg_credit_score < 650:
            total_risk_score = total_risk_score + 1

        if total_risk_score <= 2:
            final_credit_rating = "AAA"
        elif total_risk_score <= 5:
            final_credit_rating = "BBB"
        else:
            final_credit_rating = "C"
        return {
            "success": True,
            "message": "Risk rating calculated successfully",
            "payload": {
                "final_credit_rating": final_credit_rating,
            }
        }
    except Exception as e:
        logger.error(f"Error calculating final credit rating: {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Error calculating final credit rating")
    