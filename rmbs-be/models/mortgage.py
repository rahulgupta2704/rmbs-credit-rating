from sqlalchemy import Column, Integer, Float, Enum, TIMESTAMP
from sqlalchemy.sql import func
from db import Base

class Mortgage(Base):
    __tablename__ = "mortgages"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    credit_score = Column(Integer, nullable=False)
    loan_amount = Column(Float, nullable=False)
    property_value = Column(Float, nullable=False)
    annual_income = Column(Float, nullable=False)
    debt_amount = Column(Float, nullable=False)
    loan_type = Column(Enum("fixed", "adjustable"), nullable=False)
    property_type = Column(Enum("single_family", "condo"), nullable=False)
    created_at = Column(TIMESTAMP, server_default=func.current_timestamp())